import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Link as MUILink,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  GitHub,
  ExpandMore,
  Search,
  School,
  AssignmentTurnedIn,
  Checklist,
  Article,
  DesignServices,
  Terminal,
  Link as LinkIcon,
} from '@mui/icons-material';

const OnboardingTask = () => {
  const [query, setQuery] = useState('');

  // Content extracted and adapted from the attached "User Onboarding Guide & Task"
  const sections = useMemo(
    () => [
      {
        id: 'introduction',
        icon: <School color="primary" />,
        title: '1. Introduction',
        summary:
          'Welcome to the comprehensive onboarding guide for new team members. This guide covers essential tools, workflows, and best practices for successful project collaboration.',
        items: [
          'Learn version control with Git and GitHub for effective team collaboration',
          'Master Jira for project management and sprint tracking',
          'Explore UI/UX design with Figma',
          'Build modern web applications with React',
          'Follow company coding standards and best practices',
        ],
      },
      {
        id: 'github-usage',
        icon: <GitHub color="action" />,
        title: '2. GitHub Usage',
        chips: ['GitHub', 'PRs', 'Basics'],
        children: [
          {
            id: 'copying-repository-link',
            title: '2.1 Copying Repository Link',
            items: [
              'Open the repository on GitHub and click the Code button. [Doc]',
              'Select HTTPS and copy the link for cloning. [Doc]',
            ],
          },
          {
            id: 'creating-a-pull-request',
            title: '2.2 Creating a Pull Request',
            items: [
              'Push branch, then click Compare & pull request on GitHub. [Doc]',
              'Choose base (main or feature), confirm compare branch, add description and reviewers, then create PR. [Doc]',
              'PRs must be reviewed before merge; ensure branches are correct. [Doc]',
            ],
          },
          {
            id: 'github-basics',
            title: '2.3 GitHub Basics',
            items: [
              'Repository → Online project folder. [Doc]',
              'Branch → Independent workspace. [Doc]',
              'Pull Request → Proposal to merge one branch into another. [Doc]',
            ],
          },
        ],
      },
      {
        id: 'git-local-usage',
        icon: <Terminal color="action" />,
        title: '3. Git Local Usage',
        chips: ['CLI', 'Daily Flow', 'Rebase'],
        children: [
          {
            id: 'starting-work',
            title: '3.1 Starting Work',
            items: [
              'Existing project: git clone <repo-link> to copy all history locally. [Doc]',
              'New project: git init to start tracking and enable commits/branches. [Doc]',
            ],
          },
          {
            id: 'day-to-day-workflow',
            title: '3.2 Day-to-Day Workflow',
            items: [
              'Pull latest: git pull -r to stay up-to-date and avoid conflicts. [Doc]',
              'Create task branch: git checkout -b FEATURE/TG/AGS-258 following Jira-based naming. [Doc]',
              'Stage changes: git add <file> or git add . to control what to commit. [Doc]',
              'Commit: git commit -m "Message" with clear context. [Doc]',
              'Push: git push origin FEATURE/TG/AGS-258 then open a PR. [Doc]',
            ],
          },
          {
            id: 'managing-history',
            title: '3.3 Managing History',
            items: [
              'View: git log to inspect commit history. [Doc]',
              'Revert unstaged file: git checkout -- <file>. [Doc]',
              'Unstage: git reset <file> to remove from index. [Doc]',
              'Undo last keep changes: git reset --soft HEAD~1. [Doc]',
              'Undo last discard: git reset --hard HEAD~1 (dangerous). [Doc]',
              'Stash and restore: git stash / git stash pop. [Doc]',
            ],
          },
          {
            id: 'branching-workflow',
            title: '3.4 Branching Workflow',
            items: ['Use branches to isolate work until ready to merge. [Doc]'],
            children: [
              {
                id: 'naming-convention',
                title: '3.4.1 Jira-based Naming',
                items: [
                  '<type>/<initials>/<ticket> e.g., FEATURE/TG/AGS-258 or BUGFIX/AB/AGS-310. [Doc]',
                  'Types: FEATURE for new features, BUGFIX for fixes; use developer initials. [Doc]',
                ],
              },
              {
                id: 'commands',
                title: '3.4.2 Commands',
                items: [
                  'Create from main: git checkout -b FEATURE/TG/AGS-258. [Doc]',
                  'Switch: git checkout FEATURE/TG/AGS-258 updates working tree. [Doc]',
                  'List: git branch (current starred). [Doc]',
                  'Rebase on main: git checkout FEATURE/TG/AGS-258 then git rebase main. [Doc]',
                ],
              },
              {
                id: 'notes',
                title: '3.4.3 Notes',
                items: [
                  'Branch from latest main; one ticket equals one branch. [Doc]',
                  'Push via Pull Requests; avoid direct pushes to main. [Doc]',
                ],
              },
            ],
          },
          {
            id: 'branching-visual',
            title: '3.5 Branching Strategy (Visual)',
            items: ['Refer to the document’s visual diagrams for branching strategy. [Doc]'],
          },
          {
            id: 'pr-visual',
            title: '3.6 Pull Request Strategy (Visual)',
            items: [
              'Refer to PR flow visual; always add at least one reviewer and resolve conflicts locally. [Doc]',
            ],
          },
          {
            id: 'handling-conflicts',
            title: '3.7 Handling Conflicts',
            items: [
              'When same lines change, VS Code shows conflict markers to accept current/incoming/both or edit manually. [Doc]',
              'After resolving, save, stage (git add), and commit the resolution. [Doc]',
            ],
          },
          {
            id: 'tasks',
            title: '3.8 Tasks',
            items: [
              'Repo setup and correct cloning. [Doc]',
              'Branching with company convention. [Doc]',
              'Make changes and create meaningful commits. [Doc]',
              'Open PR to main with reviewer and comparisons. [Doc]',
              'Rebase with latest main, keep history clean. [Doc]',
              'Create and resolve a merge conflict locally. [Doc]',
              'Show history, undo soft/hard, and stash usage. [Doc]',
              'Finalize PR and ensure changes integrate into main. [Doc]',
            ],
          },
          {
            id: 'evaluation-criteria',
            title: '3.9 Evaluation Criteria',
            items: [
              'Correct branch naming and clean commit history. [Doc]',
              'Proper PR usage with reviewers and conflict handling. [Doc]',
              'Rebase proficiency, log/stash/reset correctness, and clean merges. [Doc]',
            ],
          },
        ],
      },
      {
        id: 'jira-basics',
        icon: <AssignmentTurnedIn color="action" />,
        title: '4. Jira Basics for Tickets & Sprints',
        chips: ['Jira', 'Sprints'],
        children: [
          {
            id: 'checking-assigned-tickets',
            title: '4.1 Checking Assigned Tickets',
            items: [
              'Go to Board → Active Sprint/Backlog and use Assigned to Me filter. [Doc]',
              'View ticket cards across To Do, In Progress, Done. [Doc]',
            ],
          },
          {
            id: 'changing-ticket-flow',
            title: '4.2 Changing Ticket Flow',
            items: [
              'Drag cards across columns or change Status in ticket. [Doc]',
              'Keep status updated to reflect progress. [Doc]',
            ],
          },
          {
            id: 'what-is-a-sprint',
            title: '4.3 What is a Sprint?',
            items: [
              'A sprint is a 1–2 week timebox moving tickets from backlog to delivery. [Doc]',
              'Tickets flow To Do → In Progress → Done within the sprint. [Doc]',
            ],
          },
        ],
      },
      {
        id: 'figma-task',
        icon: <DesignServices color="action" />,
        title: '5. Figma Practical Task — Website Design',
        chips: ['Figma', 'Templates'],
        children: [
          {
            id: 'reference-templates',
            title: '5.1 Reference Templates',
            items: ['Business Frontpage and Modern Business templates as references. [Doc]'],
            links: [
              {
                label: 'Business Frontpage',
                href: 'https://startbootstrap.com/previews/business-frontpage',
              },
              {
                label: 'Modern Business',
                href: 'https://startbootstrap.com/previews/modern-business',
              },
            ],
          },
          {
            id: 'figma-task-instructions',
            title: '5.2 Task',
            items: [
              'Complete the referenced YouTube video and design both templates in Figma. [Doc]',
            ],
            links: [
              { label: 'Video Tutorial', href: 'https://www.youtube.com/watch?v=clSHs94hNNc' },
            ],
          },
        ],
      },
      {
        id: 'react-basics',
        icon: <Article color="action" />,
        title: '6. React Basics',
        chips: ['React', 'Todo App'],
        children: [
          {
            id: 'topics-to-cover',
            title: '6.1 Topics to Cover',
            items: [
              'Vite/Cra setup, folder structure, JSX, components, props, state, and events. [Doc]',
              'Conditional rendering, lists/keys, forms, useEffect, and styling basics. [Doc]',
            ],
          },
          {
            id: 'react-task',
            title: '6.2 Task — Todo App',
            items: [
              'Add, complete/incomplete, delete todos; separate active/completed with state. [Doc]',
            ],
            children: [
              {
                id: 'design-requirements',
                title: '6.2.1 Design Requirements',
                items: [
                  'Header, centered input+button, card-styled list, visual for completed, footer count. [Doc]',
                ],
              },
              {
                id: 'responsive-requirements',
                title: '6.2.2 Responsive Requirements',
                items: [
                  'Desktop/tablet/mobile support; input/button adapt; vertical stacking on mobile. [Doc]',
                ],
              },
            ],
          },
        ],
      },
    ],
    []
  );

  const flatText = node =>
    [
      node.title || '',
      node.summary || '',
      ...(node.items || []),
      ...((node.children || []).flatMap(flatText) || []),
    ]
      .join(' ')
      .toLowerCase();

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    const filterNode = node => {
      const matches = flatText(node).includes(q);
      const children = (node.children || []).map(filterNode).filter(Boolean);
      if (matches || children.length) {
        return { ...node, children };
      }
      return null;
    };
    return sections.map(filterNode).filter(Boolean);
  }, [query, sections]);

  const scrollTo = id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // PropTypes definition for the node structure
  const nodePropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.element,
    summary: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.string),
    chips: PropTypes.arrayOf(PropTypes.string),
    links: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
      })
    ),
    children: PropTypes.array, // Using array instead of recursive definition
  });

  const SectionAccordion = ({ node, level = 0 }) => (
    <Accordion id={node.id} defaultExpanded={level === 0} disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{ bgcolor: level === 0 ? '#f8f9fa' : 'transparent' }}
      >
        <Box className="d-flex align-items-center gap-2 w-100">
          {level === 0 && node.icon}
          <Typography
            variant={level === 0 ? 'h6' : 'subtitle1'}
            sx={{ fontWeight: level === 0 ? 700 : 600 }}
          >
            {node.title}
          </Typography>
          <Box className="ms-auto d-none d-md-flex align-items-center gap-2">
            {(node.chips || []).map(c => (
              <Chip key={c} label={c} size="small" color="primary" variant="outlined" />
            ))}
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {node.summary && (
          <Typography variant="body1" color="text.secondary" className="mb-3">
            {node.summary.replace(' [Doc]', '')}
          </Typography>
        )}
        {node.items && node.items.length > 0 && (
          <List dense>
            {node.items.map((it, idx) => (
              <ListItemButton key={idx} sx={{ borderRadius: 1 }}>
                <ListItemIcon>
                  <Checklist fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText primary={it.replace(' [Doc]', '')} />
              </ListItemButton>
            ))}
          </List>
        )}
        {node.links && node.links.length > 0 && (
          <Box className="d-flex flex-wrap gap-2 mt-2">
            {node.links.map(l => (
              <Chip
                key={l.href}
                icon={<LinkIcon />}
                label={
                  <MUILink href={l.href} target="_blank" rel="noopener" underline="hover">
                    {l.label}
                  </MUILink>
                }
                variant="outlined"
              />
            ))}
          </Box>
        )}
        {node.children && node.children.length > 0 && (
          <Box className="mt-2">
            {node.children.map(child => (
              <SectionAccordion key={child.id} node={child} level={level + 1} />
            ))}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );

  SectionAccordion.propTypes = {
    node: nodePropType.isRequired,
    level: PropTypes.number,
  };

  SectionAccordion.defaultProps = {
    level: 0,
  };

  return (
    <Box className="min-vh-100 bg-light">
      <AppBar position="sticky" color="inherit" elevation={1} sx={{ bgcolor: 'white' }}>
        <Toolbar className="container">
          <School className="me-2" color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Onboarding Guide
          </Typography>
          <Box className="ms-auto" sx={{ width: { xs: '100%', md: 380 } }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search sections, steps, commands..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Box className="container py-4">
        <div className="row g-3">
          {/* TOC */}
          <div className="col-lg-3">
            <Paper variant="outlined" sx={{ position: 'sticky', top: '80px' }}>
              <Box className="p-3">
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }} className="mb-2">
                  Table of Contents
                </Typography>
                <Divider className="mb-2" />
                <List dense>
                  {filteredSections.map(s => (
                    <Box key={s.id}>
                      <ListItemButton onClick={() => scrollTo(s.id)} sx={{ borderRadius: 1 }}>
                        <ListItemIcon>{s.icon}</ListItemIcon>
                        <ListItemText primary={s.title} />
                      </ListItemButton>
                      {(s.children || []).slice(0, 3).map(c => (
                        <ListItemButton
                          key={c.id}
                          onClick={() => scrollTo(c.id)}
                          sx={{ pl: 6, borderRadius: 1 }}
                        >
                          <ListItemText primary={c.title} />
                        </ListItemButton>
                      ))}
                      <Divider />
                    </Box>
                  ))}
                </List>
              </Box>
            </Paper>
          </div>

          {/* Content */}
          <div className="col-lg-9">
            <Box className="d-flex flex-column gap-3">
              {filteredSections.map(node => (
                <SectionAccordion key={node.id} node={node} />
              ))}
            </Box>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default OnboardingTask;
