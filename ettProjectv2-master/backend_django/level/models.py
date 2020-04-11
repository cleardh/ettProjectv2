from django.db import models
from django.conf import settings


class Level(models.Model):
    class Meta:
        verbose_name_plural = "Levels"
        
    LevelID        = models.AutoField(primary_key=True, null=False)
    title         = models.CharField(max_length=30, null=True, unique=True)    

    def __str__(self):
        return str(self.title)