from django.shortcuts import render
from django import forms
from .forms import JobsForm
from .models import Jobs
from backend.decorators import unauthenticated_user, allowed_users

from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import JobSerializer
from .models import Jobs

@unauthenticated_user
@allowed_users(allowed_roles=['admin'])
def jobs_create_view(request):
    form = JobsForm(request.POST or None)
    if form.is_valid():
        form.save()

    context = {
        'form': form
        }

    return render(request, "jobs.html", context)


class JobView(APIView):
    def get(self, request):
        categories = Jobs.objects.all()
        serializer = JobSerializer(categories, many=True)
        return Response(serializer.data)