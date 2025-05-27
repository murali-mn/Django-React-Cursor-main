from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.decorators import api_view

from .models import ProjectManager, Employees, Project
from .serializers import ProjectManagerSerializer, EmployeesSerializer, ProjectSerializer

# Create your views here.
@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'projectmanagers': reverse('projectmanager-list-create', request=request, format=format),
        'employees': reverse('employees-list-create', request=request, format=format),
        'projects': reverse('project-list-create', request=request, format=format)
    })

class ProjectManagerListCreate(generics.ListCreateAPIView):
    queryset = ProjectManager.objects.all()
    serializer_class = ProjectManagerSerializer

class ProjectManagerRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProjectManager.objects.all()
    serializer_class = ProjectManagerSerializer

class EmployeesListCreate(generics.ListCreateAPIView):
    queryset = Employees.objects.all()
    serializer_class = EmployeesSerializer

class EmployeesRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employees.objects.all()
    serializer_class = EmployeesSerializer

class ProjectListCreate(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class ProjectRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly] # Optional: Add permissions
