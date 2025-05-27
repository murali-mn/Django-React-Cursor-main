import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import apiClient from '../services/api';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Using the general adapter path

// Validation Schema
const schema = yup.object().shape({
    name: yup.string().required('Project name is required').max(255),
    projectmanager_id: yup.number().nullable().transform(value => (isNaN(value) || value === null || value === '' ? null : Number(value)) ).required("Project Manager is required"),
    start_date: yup.date().required('Start date is required').typeError('Invalid date format'),
    end_date: yup.date().nullable().typeError('Invalid date format').min(yup.ref('start_date'), 'End date cannot be before start date'),
    status: yup.string().required('Status is required'),
    comments: yup.string().nullable(),
    employees: yup.array().of(yup.number()).nullable(), // Array of employee IDs
});

const ProjectForm = ({ open, onClose, onSubmit, project }) => {
    const [projectManagers, setProjectManagers] = useState([]);
    const [employeesList, setEmployeesList] = useState([]);
    const [loadingDropdowns, setLoadingDropdowns] = useState(true);
    const [formError, setFormError] = useState(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            projectmanager_id: null,
            start_date: null,
            end_date: null,
            status: 'Open',
            comments: '',
            employees: [],
        },
    });

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                setLoadingDropdowns(true);
                const [pmResponse, empResponse] = await Promise.all([
                    apiClient.get('/projectmanagers/'),
                    apiClient.get('/employees/'),
                ]);
                setProjectManagers(pmResponse.data || []);
                setEmployeesList(empResponse.data || []);
            } catch (error) {
                console.error("Failed to fetch dropdown data", error);
                setFormError("Failed to load necessary data for the form.");
            } finally {
                setLoadingDropdowns(false);
            }
        };
        if (open) {
            fetchDropdownData();
        }
    }, [open]);

    useEffect(() => {
        if (project) {
            reset({
                name: project.name || '',
                projectmanager_id: project.projectmanager || null,
                start_date: project.start_date ? new Date(project.start_date) : null,
                end_date: project.end_date ? new Date(project.end_date) : null,
                status: project.status || 'Open',
                comments: project.comments || '',
                employees: project.employees || [],
            });
        } else {
            reset({
                name: '',
                projectmanager_id: null,
                start_date: null,
                end_date: null,
                status: 'Open',
                comments: '',
                employees: [],
            });
        }
    }, [project, reset, open]);

    const handleFormSubmitInternal = async (data) => {
        setFormError(null);
        try {
            const payload = {
                ...data,
                start_date: data.start_date ? data.start_date.toISOString().split('T')[0] : null,
                end_date: data.end_date ? data.end_date.toISOString().split('T')[0] : null,
                projectmanager_id: data.projectmanager_id ? Number(data.projectmanager_id) : null,
            };
            const apiPayload = {
                ...payload,
                projectmanager: payload.projectmanager_id,
            };
            delete apiPayload.projectmanager_id;

            await onSubmit(apiPayload, project?.id);
            onClose();
        } catch (error) {
            console.error("Submission error:", error);
            setFormError(error.response?.data?.detail || error.message || 'An unexpected error occurred.');
        }
    };
    
    const handleCloseDialog = () => {
        reset(); // Reset form fields
        setFormError(null);
        onClose();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Dialog open={open} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
                <DialogTitle 
                    sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        px: 3, // Horizontal padding (left/right)
                        py: 1.5, // Vertical padding (top/bottom)
                        // paddingBottom: 1 // Keep or adjust if still needed with py
                    }}
                >
                    {project ? 'Edit Project' : 'Add New Project'}
                </DialogTitle>
                <form onSubmit={handleSubmit(handleFormSubmitInternal)} noValidate>
                    <DialogContent sx={{ py: 2.5, px: 3 }}>
                        {loadingDropdowns && <CircularProgress sx={{display: 'block', margin: 'auto', marginBottom: 2.5}}/>}
                        {!loadingDropdowns && (
                            <Grid container spacing={2.5}>
                                <Grid item xs={12}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Project Name"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={!!errors.projectmanager_id} required>
                                        <InputLabel id="projectmanager-label">Project Manager</InputLabel>
                                        <Controller
                                            name="projectmanager_id"
                                            control={control}
                                            defaultValue={null}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    value={field.value === null ? '' : field.value}
                                                    labelId="projectmanager-label"
                                                    label="Project Manager"
                                                    MenuProps={{
                                                        PaperProps: {
                                                            style: {
                                                                minWidth: field.ref?.clientWidth || 200,
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <MenuItem value=""><em>Select Project Manager</em></MenuItem>
                                                    {projectManagers.map((pm) => (
                                                        <MenuItem key={pm.id} value={pm.id}>
                                                            {pm.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                        {errors.projectmanager_id && <FormHelperText>{errors.projectmanager_id.message}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Status"
                                                variant="outlined"
                                                fullWidth
                                                select
                                                required
                                                error={!!errors.status}
                                                helperText={errors.status?.message}
                                            >
                                                <MenuItem value="Open">Open</MenuItem>
                                                <MenuItem value="Pending">Pending</MenuItem>
                                                <MenuItem value="Closed">Closed</MenuItem>
                                            </TextField>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="start_date"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                {...field}
                                                label="Start Date"
                                                inputFormat="MM/dd/yyyy"
                                                renderInput={(params) => <TextField {...params} fullWidth required error={!!errors.start_date} helperText={errors.start_date?.message} />}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="end_date"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                {...field}
                                                label="End Date"
                                                inputFormat="MM/dd/yyyy"
                                                renderInput={(params) => <TextField {...params} fullWidth error={!!errors.end_date} helperText={errors.end_date?.message} />}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth error={!!errors.employees}>
                                        <InputLabel id="employees-label">Assign Employees</InputLabel>
                                        <Controller
                                            name="employees"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    labelId="employees-label"
                                                    label="Assign Employees"
                                                    multiple
                                                    MenuProps={{
                                                        PaperProps: {
                                                            style: {
                                                                minWidth: field.ref?.clientWidth || 250,
                                                                maxHeight: 300,
                                                            },
                                                        },
                                                    }}
                                                >
                                                    {employeesList.map((emp) => (
                                                        <MenuItem key={emp.id} value={emp.id}>
                                                            {emp.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                        {errors.employees && <FormHelperText>{errors.employees.message}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="comments"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Comments"
                                                variant="outlined"
                                                fullWidth
                                                multiline
                                                rows={3}
                                                error={!!errors.comments}
                                                helperText={errors.comments?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        )}
                        {formError && <Alert severity="error" sx={{ mt: 2.5 }}>{formError}</Alert>}
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
                        <Button onClick={handleCloseDialog} color="secondary" variant="outlined" disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting || loadingDropdowns}>
                            {isSubmitting ? <CircularProgress size={24} /> : (project ? 'Save Changes' : 'Create Project')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </LocalizationProvider>
    );
};

export default ProjectForm; 