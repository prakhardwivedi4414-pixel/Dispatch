import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Legacy WorkspacePage redirect
 * The workspace has been split into:
 * - /editorial (Editorial CMS Dashboard)
 * - /editorial/edit/:id (Story Editor)
 * - /editorial/contributors (Contributors Roster)
 * - /editorial/internal (Admin-only Assessment Dossier)
 */
export const WorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/editorial', { replace: true });
  }, [navigate]);

  return null;
};

export default WorkspacePage;
