from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    SUBSCRIPTION_CHOICES = (
        ('FREE', 'Free'),
        ('PAID', 'Paid'),
    )
    
    phone = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    subscription_tier = models.CharField(max_length=10, choices=SUBSCRIPTION_CHOICES, default='FREE')
    daily_mocks_used = models.PositiveIntegerField(default=0)
    last_mock_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.username
