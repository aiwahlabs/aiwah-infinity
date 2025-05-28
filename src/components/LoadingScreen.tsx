'use client';

/**
 * LoadingScreen is a full-page component displayed while the application is in a loading state,
 * typically during initial data fetching or authentication checks.
 *
 * It uses inline styles and embedded JSX CSS for the spinner animation. This approach ensures
 * that the loading screen can be rendered immediately without dependencies on external CSS files
 * or UI libraries like Chakra UI (ThemeProvider), which might not be available or fully initialized
 * at the very start of the application lifecycle (e.g., during the first paint or when auth
 * status is being determined). This prevents a flash of unstyled content or errors.
 */
export function LoadingScreen() {
  // Using plain HTML/CSS for the loading screen
  // This ensures it works even before ThemeProvider/ChakraProvider mounts
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#171923',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div className="spinner"></div>
      <div style={{ color: 'white', fontSize: '18px' }}>
        Loading application...
      </div>
      
      {/* CSS for spinner */}
      <style jsx>{`
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border-left-color: #3182ce;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 