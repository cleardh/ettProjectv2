from django.db import models
from django.conf import settings
from django.contrib.auth.models import User


class Organization(models.Model):    
    OrganizationID   = models.AutoField(primary_key=True, null=False)
    title            = models.CharField(max_length=30, null=False, unique=True)    
    level            = models.IntegerField(null=False)    
    head             = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.title)