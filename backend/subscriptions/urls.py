from django.urls import path
from .views import SubscriptionPlanListView, InitializePaymentView, PaystackWebhookView

urlpatterns = [
    path('plans/', SubscriptionPlanListView.as_view(), name='plans'),
    path('paystack/initialize/', InitializePaymentView.as_view(), name='paystack_initialize'),
    path('paystack/webhook/', PaystackWebhookView.as_view(), name='paystack_webhook'),
]
