from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import JobSerializer
from .models import Jobs
from django.shortcuts import get_object_or_404

@api_view(['GET'])
def getJobs(request):
    jobs = Jobs.objects.all()
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def addJobs(request):
    serializer = JobSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['GET'])
def getJobByID(request, pk):
    job = get_object_or_404(Jobs, pk=pk)
    serializer = JobSerializer(job)
    return Response(serializer.data)

@api_view(['GET'])
def deleteJob(request, pk):
    Jobs.objects.filter(pk=pk).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def getJobByTitle(request, title):        
    job = get_object_or_404(Jobs, title=title)
    serializer = JobSerializer(job)
    return Response(serializer.data)