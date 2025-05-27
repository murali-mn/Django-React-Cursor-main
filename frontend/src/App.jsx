import React from 'react';
import ProjectTable from './components/ProjectTable';
import {
    ThemeProvider,
    createTheme,
    CssBaseline,
    Container,
    AppBar,
    Toolbar,
    Typography
} from '@mui/material';
import './App.css';

// A simple theme for demonstration
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // MUI default blue
        },
        secondary: {
            main: '#dc004e', // MUI default pink
        },
        background: {
            default: '#f4f6f8', // A light grey background
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h5: {
            fontWeight: 500,
        }
    }
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Applies baseline styling and dark mode compatibility */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Project Management Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }}>
                <ProjectTable />
            </Container>
        </ThemeProvider>
    );
}

export default App;
