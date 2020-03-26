from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import RequestSerializer
from .models import Request
from django.shortcuts import get_object_or_404
from rest_framework import status


@api_view(['POST'])
def addRequest(request):
    serializer = RequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['GET'])    
def getRequestByID(request, pk):
    req = get_object_or_404(Request, pk=pk)
    serializer = RequestSerializer(req)
    return Response(serializer.data)
    
@api_view(['POST'])
def approveRequestByID(request, pk):
    req = get_object_or_404(Request, pk=pk)
    serializer = RequestSerializer(instance=req, data=request.data)
    serializer.isConfirmed == True
    serializer.save()
    return Response(serializer.data)

@api_view(['GET'])
def deleteRequest(request, pk):
    Request.objects.filter(pk=pk).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

