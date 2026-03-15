from django.db import models
from django.conf import settings

class ExamAttempt(models.Model):
    EXAM_TYPES = (
        ('UTME', 'UTME'),
        ('WAEC', 'WAEC'),
        ('NECO', 'NECO'),
        ('POST-UTME', 'POST-UTME'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='exam_attempts')
    exam_type = models.CharField(max_length=20, choices=EXAM_TYPES)
    subject = models.CharField(max_length=50)
    year = models.CharField(max_length=4)
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    date_attempted = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.subject} ({self.year}) - {self.score}/{self.total_questions}"
