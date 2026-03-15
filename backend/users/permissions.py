from rest_framework import permissions
from django.utils import timezone

class HasMockAccess(permissions.BasePermission):
    message = "Upgrade for unlimited mocks. You have reached your daily limit of 5 free mocks."

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
            
        if user.subscription_tier == 'PAID':
            return True
            
        today = timezone.now().date()
        if user.last_mock_date != today:
            user.daily_mocks_used = 0
            user.last_mock_date = today
            user.save()
            
        if user.daily_mocks_used >= 5:
            return False
            
        return True
