from django.db import models
from django.conf import settings
from django.db import models
from roles.models import Roles
from jobs.models import Jobs
from django.db.models.signals import post_save
from django.contrib.auth.models import User


class Profile(models.Model):
    ProfileID   = models.AutoField(primary_key=True, null=False)     
    user        = models.OneToOneField(User, on_delete=models.CASCADE)
    firstName   = models.CharField(max_length=30, blank=True, null=True)
    lastName    = models.CharField(max_length=30, blank=True, null=True)
    email       = models.CharField(max_length=30, blank=True, null=True)    
    role        = models.ForeignKey(Roles, on_delete=models.SET_NULL, default=1, blank=True, null=True)
    job         = models.ForeignKey(Jobs, on_delete=models.SET_NULL, default=1, blank=True, null=True)    
    dateHired   = models.DateField(auto_now_add=False, auto_now=False, default='2000-01-01', blank=True, null=True)
    phone       = models.CharField(max_length=30, default='000-000-0000', blank=True, null=True)
    calendarID  = models.CharField(max_length=30, default='0000000000', blank=True, null=True)
    image       = models.CharField(max_length=1000, default='path/image', blank=True, null=True)

    def __str__(self):
        return str(self.user)
    

    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance, firstName=instance.first_name, lastName=instance.last_name, email=instance.email)
    post_save.connect(create_user_profile, sender=User)