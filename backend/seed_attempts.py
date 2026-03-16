import os
import sys
import django
import random
from datetime import timedelta
from django.utils import timezone

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User
from exams.models import ExamAttempt

def seed_db():
    print("Seeding database with fake attempts...")
    
    # Get or create a test user
    user, created = User.objects.get_or_create(username='teststudent', defaults={'email': 'test@example.com'})
    user.set_password('password123')
    user.save()
    
    if created:
        print(f"Created test user: {user.username} (password: password123)")
    else:
        print(f"Found existing test user: {user.username}")

    subjects = ['english', 'mathematics', 'physics', 'chemistry', 'biology', 'economics']
    exam_types = ['UTME', 'WAEC', 'POST-UTME']
    years = ['2019', '2020', '2021', '2022', '2023']

    # Generate 30 fake attempts over the past 30 days
    now = timezone.now()
    
    count = 0
    for i in range(30):
        date_attempted = now - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))
        total_questions = random.choice([20, 40, 50, 60])
        score = random.randint(int(total_questions * 0.3), int(total_questions * 0.95))
        
        attempt = ExamAttempt.objects.create(
            user=user,
            exam_type=random.choice(exam_types),
            subject=random.choice(subjects),
            year=random.choice(years),
            score=score,
            total_questions=total_questions,
            details={"seeded": True}
        )
        # Override auto_now_add for the seed
        ExamAttempt.objects.filter(id=attempt.id).update(date_attempted=date_attempted)
        count += 1
        
    print(f"Successfully created {count} fake attempts for user '{user.username}'.")

if __name__ == "__main__":
    seed_db()
