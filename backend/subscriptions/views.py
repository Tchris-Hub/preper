from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from .models import SubscriptionPlan
from rest_framework import serializers

import hmac
import hashlib
import json
import logging

try:
    from paystackapi.transaction import Transaction
    from paystackapi.paystack import Paystack
    paystack = Paystack(secret_key=settings.PAYSTACK_SECRET_KEY)
except ImportError:
    pass

logger = logging.getLogger(__name__)

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'

class SubscriptionPlanListView(generics.ListAPIView):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.AllowAny]

class InitializePaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        plan_id = request.data.get('plan_id')
        if not plan_id:
            return Response({'error': 'plan_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            plan = SubscriptionPlan.objects.get(id=plan_id)
        except SubscriptionPlan.DoesNotExist:
            return Response({'error': 'Invalid plan_id'}, status=status.HTTP_404_NOT_FOUND)
        
        user = request.user
        email = user.email or f"{user.username}@example.com"
        amount = int(plan.price * 100) # Convert to Kobo
        
        try:
            # Note: in modern paystackapi versions, the signature is Transaction.initialize(reference=..., amount=...) etc.
            # We can use the Transaction class directly or Paystack instance
            response = Transaction.initialize(
                email=email,
                amount=amount,
                metadata={
                    "user_id": user.id,
                    "plan_id": plan.id
                }
            )
            return Response(response['data'])
        except Exception as e:
            logger.error(f"Paystack Initialization Error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PaystackWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            signature = request.headers.get('x-paystack-signature')
            if not signature:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            
            body = request.body
            
            # Verify signature
            hash_obj = hmac.new(settings.PAYSTACK_SECRET_KEY.encode('utf-8'), body, hashlib.sha512)
            expected_signature = hash_obj.hexdigest()
            
            if expected_signature != signature:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            
            payload = json.loads(body.decode('utf-8'))
            event = payload.get('event')
            
            if event == 'charge.success':
                data = payload.get('data', {})
                metadata = data.get('metadata', {})
                
                user_id = metadata.get('user_id')
                plan_id = metadata.get('plan_id')
                
                if user_id and plan_id:
                    from django.contrib.auth import get_user_model
                    User = get_user_model()
                    try:
                        user = User.objects.get(id=user_id)
                        user.subscription_tier = 'PAID'
                        user.save()
                    except User.DoesNotExist:
                        pass
                        
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Webhook Error: {e}")
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
