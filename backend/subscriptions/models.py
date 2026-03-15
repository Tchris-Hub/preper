from django.db import models

class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.PositiveIntegerField()
    features = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.name
