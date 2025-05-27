from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api-root'), # Maps /api/ to the api_root view
    path('projectmanagers/', views.ProjectManagerListCreate.as_view(), name='projectmanager-list-create'),
    path('projectmanagers/<int:pk>/', views.ProjectManagerRetrieveUpdateDestroy.as_view(), name='projectmanager-detail'),
    path('employees/', views.EmployeesListCreate.as_view(), name='employees-list-create'),
    path('employees/<int:pk>/', views.EmployeesRetrieveUpdateDestroy.as_view(), name='employee-detail'),
    path('projects/', views.ProjectListCreate.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', views.ProjectRetrieveUpdateDestroy.as_view(), name='project-detail'),
    # Add your API URL patterns here
    # Example:
    # path('projectmanagers/', views.ProjectManagerListCreate.as_view(), name='projectmanager-list-create'),
] 