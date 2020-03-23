from django.db import models
from django.conf import settings


class Jobs(models.Model):
    class Meta:
        verbose_name_plural = "Jobs" 
    JobID   = models.AutoField(primary_key=True, null=False)
    title   = models.CharField(max_length=30, null=False)

    def __str__(self):
        return str(self.title)