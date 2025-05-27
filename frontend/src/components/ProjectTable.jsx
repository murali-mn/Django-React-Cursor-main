import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    Typography,
    Box,
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProjectForm from './ProjectForm';
import './ProjectTable.css';

const ProjectTable = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/projects/');
            setProjects(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch projects');
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleOpenFormModal = (project = null) => {
        setEditingProject(project);
        setError(null);
        setSuccessMessage(null);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setEditingProject(null);
    };

    const handleFormSubmit = async (projectData, projectId) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            if (projectId) {
                await apiClient.put(`/projects/${projectId}/`, projectData);
                setSuccessMessage('Project updated successfully!');
            } else {
                await apiClient.post('/projects/', projectData);
                setSuccessMessage('Project added successfully!');
            }
            fetchProjects();
            handleCloseFormModal();
        } catch (err) {
            const apiError = err.response?.data;
            let errorMessage = 'Failed to save project.';
            if (typeof apiError === 'object' && apiError !== null) {
                errorMessage = Object.entries(apiError).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
            } else if (typeof apiError === 'string') {
                errorMessage = apiError;
            }
            setError(errorMessage);
            console.error("Submit error:", err.response || err);
            throw err;
        } finally {
            setLoading(false);
            if (successMessage) {
                setTimeout(() => setSuccessMessage(null), 3000);
            }
        }
    };

    const handleOpenDeleteConfirm = (project) => {
        setProjectToDelete(project);
        setError(null);
        setSuccessMessage(null);
        setIsDeleteConfirmOpen(true);
    };

    const handleCloseDeleteConfirm = () => {
        setProjectToDelete(null);
        setIsDeleteConfirmOpen(false);
    };

    const handleDeleteProject = async () => {
        if (!projectToDelete) return;
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await apiClient.delete(`/projects/${projectToDelete.id}/`);
            setSuccessMessage('Project deleted successfully!');
            fetchProjects();
        } catch (err) {
            setError(err.message || 'Failed to delete project');
            console.error("Delete error:", err);
        } finally {
            setLoading(false);
            handleCloseDeleteConfirm();
            if (successMessage) {
                setTimeout(() => setSuccessMessage(null), 3000);
            }
        }
    };

    if (loading && projects.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper sx={{ margin: 2, overflow: 'hidden' }} elevation={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, backgroundColor: 'primary.main', color: 'white' }}>
                <Typography variant="h5" component="div" sx={{ textAlign: 'center', flexGrow: 1 }}>
                    Projects
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => handleOpenFormModal()} 
                    startIcon={<AddIcon />}
                    sx={{ backgroundColor: 'white', color: 'primary.main', '&:hover': { backgroundColor: '#f0f0f0'} }}
                >
                    Add Project
                </Button>
            </Box>
            
            {error && <Alert severity="error" sx={{ margin: 2 }} onClose={() => setError(null)}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ margin: 2 }} onClose={() => setSuccessMessage(null)}>{successMessage}</Alert>}
            
            <TableContainer component={Paper} className="project-table-container">
                <Table stickyHeader aria-label="projects table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Project Manager</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Comments</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && projects.length > 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <CircularProgress size={24} /> <Typography component="span" sx={{verticalAlign: 'middle', ml:1}}>Refreshing...</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {!loading && projects.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No projects found.
                                </TableCell>
                            </TableRow>
                        )}
                        {projects.map((project) => (
                            <TableRow key={project.id} hover>
                                <TableCell>{project.name}</TableCell>
                                <TableCell>{project.projectmanager_name || 'N/A'}</TableCell>
                                <TableCell>{new Date(project.start_date).toLocaleDateString()}</TableCell>
                                <TableCell>{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell>{project.status}</TableCell>
                                <TableCell sx={{ maxWidth: 200, whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                    {project.comments || 'N/A'}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => handleOpenFormModal(project)} color="primary" aria-label="edit project" disabled={loading}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDeleteConfirm(project)} color="error" aria-label="delete project" disabled={loading}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {isFormModalOpen && (
                <ProjectForm 
                    open={isFormModalOpen} 
                    onClose={handleCloseFormModal} 
                    onSubmit={handleFormSubmit} 
                    project={editingProject}
                />
            )}

            <Dialog
                open={isDeleteConfirmOpen}
                onClose={handleCloseDeleteConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Delete"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete project "{projectToDelete?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
                    <Button onClick={handleDeleteProject} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default ProjectTable; 