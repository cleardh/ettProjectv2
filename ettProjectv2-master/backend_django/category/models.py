from django.db import models
from django.conf import settings


class Category(models.Model):
    class Meta:
        verbose_name_plural = "Categories"
        
    CategoryID   = models.AutoField(primary_key=True, null=False)
    title        = models.CharField(max_length=30, null=False, unique=True)    
    limit        = models.IntegerField(null=False)
    isUnlimited  = models.BooleanField(null=False)
    color        = models.CharField(max_length=30, default='white', blank=True, null=True)


    def __str__(self):
        return str(self.title)