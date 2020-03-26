from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import JobSerializer
from .models import Jobs
from django.shortcuts import get_object_or_404

class JobView(APIView):
    def get(self, request):
        jobs = Jobs.objects.all()
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

class JobDetailView(APIView):
    
    def get(self, request, pk):
        job = get_object_or_404(Jobs, pk=pk)
        serializer = JobSerializer(job)
        return Response(serializer.data)

    def delete(self, request, pk):
        Jobs.objects.filter(pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)