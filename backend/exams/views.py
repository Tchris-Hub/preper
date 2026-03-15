from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.conf import settings
import requests
from .models import ExamAttempt
from users.permissions import HasMockAccess
import hashlib
import json

class QuestionsProxy(APIView):
    permission_classes = [permissions.IsAuthenticated, HasMockAccess]

    def get(self, request):
        params = request.query_params.dict()
        param_str = json.dumps(params, sort_keys=True)
        cache_key = f"aloc_questions_{hashlib.md5(param_str.encode()).hexdigest()}"
        
        data = cache.get(cache_key)
        if not data:
            aloc_token = getattr(settings, 'ALOC_TOKEN', '')
            headers = {
                "AccessToken": aloc_token,
                "Accept": "application/json"
            }
            
            try:
                # ALOC v2 has a limit of ~20 questions per batch. We fetch twice to get 40.
                all_questions = []
                print(f"DEBUG: Fetching questions for params: {params}")
                
                for i in range(2):
                    max_retries = 2
                    for attempt in range(max_retries):
                        print(f"DEBUG: Requesting batch {i+1} (Attempt {attempt+1})...")
                        try:
                            resp = requests.get("https://questions.aloc.com.ng/api/v2/q/20", params=params, headers=headers, timeout=12)
                            print(f"DEBUG: Batch {i+1} Status: {resp.status_code}")
                            
                            try:
                                resp_data = resp.json()
                            except ValueError:
                                print(f"DEBUG: Batch {i+1} JSON Decode Error. Response text: {resp.text[:200]}")
                                break # Fall through to retry or error handle

                            if resp.status_code == 200:
                                batch = resp_data.get('data', [])
                                if isinstance(batch, list):
                                    all_questions.extend(batch)
                                elif isinstance(batch, dict):
                                    all_questions.append(batch)
                                print(f"DEBUG: Added {len(all_questions)} total questions so far.")
                                break # Success for this batch
                            elif resp.status_code == 406 or "AccessToken not valid" in str(resp_data.get("error", "")):
                                print(f"DEBUG: Invalid Token Error: {resp_data}")
                                return Response({"error": "ALOC API Token invalid.", "details": "Check your .env file."}, status=status.HTTP_401_UNAUTHORIZED)
                            else:
                                print(f"DEBUG: API Error: {resp_data}")
                                break # Non-retryable error
                        except requests.RequestException as e:
                            print(f"DEBUG: RequestException for batch {i+1}: {str(e)}")
                            if attempt == max_retries - 1:
                                print("DEBUG: All retries failed for this batch.")
                                break
                            continue # Try again
                
                if not all_questions:
                    return Response({"error": "Failed to fetch any questions after retries. ALOC API is under heavy load."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

                # Construct final response
                data = {"status": 200, "data": all_questions}
                print(f"DEBUG: Success! Returning {len(all_questions)} questions.")
                # Only cache if we got a decent sample
                if len(all_questions) >= 5:
                    cache.set(cache_key, data, timeout=3600 * 24)
                
            except Exception as e:
                print(f"DEBUG: Unexpected error: {str(e)}")
                return Response({"error": "Unexpected server error", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(data)
        
        return Response(data)

class SubmitExamView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data
        
        attempt = ExamAttempt.objects.create(
            user=user,
            exam_type=data.get('exam_type', 'UTME'),
            subject=data.get('subject', 'Unknown'),
            year=data.get('year', '2020'),
            score=data.get('score', 0),
            total_questions=data.get('total_questions', 0),
            details=data.get('details', {})
        )
        
        if user.subscription_tier == 'FREE':
            user.daily_mocks_used += 1
            user.save()
            
        return Response({"status": "success", "attempt_id": attempt.id})

class ExamHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        attempts = ExamAttempt.objects.filter(user=request.user).order_by('-date_attempted')
        data = [
            {
                "id": a.id,
                "exam_type": a.exam_type,
                "subject": a.subject,
                "year": a.year,
                "score": a.score,
                "total_questions": a.total_questions,
                "date_attempted": a.date_attempted,
            } for a in attempts
        ]
        return Response(data)

class ExamAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from django.db.models import Avg, Count
        attempts = ExamAttempt.objects.filter(user=request.user)
        
        subject_stats = attempts.values('subject').annotate(
            avg_score=Avg('score'),
            count=Count('id')
        )
        
        return Response({
            "subject_stats": list(subject_stats),
            "total_attempts": attempts.count()
        })
