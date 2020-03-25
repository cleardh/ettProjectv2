from django.db import models
from django.conf import settings


class Category(models.Model):
    class Meta:
        verbose_name_plural = "Categories"
        
    CategoryID   = models.AutoField(primary_key=True, null=False)
    name         = models.CharField(max_length=30, null=False, unique=True)    
    limit        = models.IntegerField(null=False)
    isUnlimited  = models.BooleanField(null=False)


    def __str__(self):
        return str(self.name)