from django.db import models
from django.conf import settings
from profile.models import Profile
from category.models import Category
from datetime import date


class Request(models.Model):        
    RequestID     = models.AutoField(primary_key=True, null=False)
    profile       = models.ForeignKey(Profile, on_delete=models.CASCADE)
    dateS         = models.DateField(auto_now_add=False, auto_now=False, blank=True)
    dateE         = models.DateField(auto_now_add=False, auto_now=False, blank=True)
    category      = models.ForeignKey(Category, on_delete=models.CASCADE)
    isConfirmed   = models.BooleanField(default=False, null=False)
    googleEventID = models.CharField(max_length=30, default='0000000000', blank=True, null=True)


    def __str__(self):
        return str(self.RequestID)