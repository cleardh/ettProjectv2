from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from category.models import Category
from datetime import date


class Request(models.Model):        
    RequestID    = models.AutoField(primary_key=True, null=False)
    user         = models.ForeignKey(User, on_delete=models.CASCADE)
    dateS        = models.DateField(auto_now_add=False, auto_now=False, blank=True)
    dateE        = models.DateField(auto_now_add=False, auto_now=False, blank=True)
    category     = models.ForeignKey(Category, on_delete=models.CASCADE)
    isConfirmed  = models.BooleanField(default=False, null=False)


    def __str__(self):
        return str(self.RequestID)