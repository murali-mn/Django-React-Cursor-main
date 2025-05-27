from rest_framework import serializers
from .models import ProjectManager, Employees, Project

class ProjectManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectManager
        fields = ['id', 'name', 'created', 'modified'] # Specify fields to include 

class EmployeesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employees
        fields = ['id', 'name', 'created', 'modified'] 

class ProjectSerializer(serializers.ModelSerializer):
    projectmanager_name = serializers.StringRelatedField(source='projectmanager', read_only=True)
    # The 'projectmanager' field (ForeignKey on model) will handle the ID for read/write.

    class Meta:
        model = Project
        fields = [
            'id', 'name', 
            'employees', # Sends/accepts list of employee IDs
            'projectmanager', # This will be the ID for GET, and accept ID for POST/PUT
            'projectmanager_name', # Shows ProjectManager name on GET (read-only)
            'start_date', 'end_date', 'comments', 'status', 
            'created', 'modified'
        ]
        read_only_fields = ['created', 'modified', 'projectmanager_name']
        extra_kwargs = {
            'projectmanager': {'allow_null': True, 'required': False} # Corresponds to model's ForeignKey settings
        }

    # Note: The yup schema in ProjectForm.jsx uses 'projectmanager_id'.
    # The form submission logic in ProjectForm.jsx also constructs a payload with 'projectmanager_id'.
    # To align, we either:
    # 1. Change yup schema and form logic to use 'projectmanager' as the field name for the ID.
    # 2. Or, keep ProjectForm.jsx as is (using 'projectmanager_id') and ensure the API GET response
    #    provides 'projectmanager_id' (which means the serializer change above might not be right, 
    #    and the previous serializer was closer but needed projectmanager_id to be readable).

    # Let's revert to a slightly modified previous approach that ensures projectmanager_id is readable.
    # projectmanager_id = serializers.PrimaryKeyRelatedField(
    #     queryset=ProjectManager.objects.all(), 
    #     source='projectmanager', 
    #     allow_null=True, 
    #     required=False
    #     # removed write_only=True to make it readable
    # )

    # If you use a separate field for projectmanager_id for writing,
    # you might need to remove the original 'projectmanager' from the list of fields
    # if DRF complains about ambiguity, or ensure only one is writeable.
    # The current setup with projectmanager_name (read-only) and projectmanager_id (write-only)
    # should work fine. 