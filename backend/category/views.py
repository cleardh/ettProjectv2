from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import CategorySerializer
from .models import Category
from django.shortcuts import get_object_or_404

@api_view(['GET'])
def getCategories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def addCategories(request):
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['GET'])
def getCategoryByID(request, pk):
    category = get_object_or_404(Category, pk=pk)
    serializer = CategorySerializer(category)
    return Response(serializer.data)

@api_view(['GET'])
def deleteCategory(request, pk):
    Category.objects.filter(pk=pk).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def getCategoryByName(request, name):        
    category = get_object_or_404(Category, name=name)
    serializer = CategorySerializer(category)
    return Response(serializer.data)