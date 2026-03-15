from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Profile', {'fields': ('phone', 'profile_picture', 'subscription_tier', 'daily_mocks_used', 'last_mock_date')}),
    )

admin.site.register(User, CustomUserAdmin)
