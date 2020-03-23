from django.db import models
from django.conf import settings
from django.db import models
from roles.models import Roles
from jobs.models import Jobs
from django.contrib.auth.models import User


class Profile(models.Model):
    ProfileID   = models.AutoField(primary_key=True, null=False)     
    user        = models.OneToOneField(User, on_delete=models.CASCADE)
    firstName   = models.CharField(max_length=30, null=True)
    lastName    = models.CharField(max_length=30, null=True)
    email       = models.CharField(max_length=30, null=True)    
    role        = models.ForeignKey(Roles, on_delete=models.CASCADE)
    job         = models.ForeignKey(Jobs, on_delete=models.CASCADE)    
    dateHired   = models.DateField(auto_now_add=False, auto_now=False, blank=True)
    phone       = models.CharField(max_length=30, null=True)


    def __str__(self):
        return str(self.user)