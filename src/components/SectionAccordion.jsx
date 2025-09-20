import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Link as MUILink,
} from '@mui/material';
import {
  ExpandMore,
  Checklist,
  Link as LinkIcon,
} from '@mui/icons-material';

// Define the recursive node PropType
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
  children: PropTypes.arrayOf(PropTypes.lazy(() => nodePropType)),
});

function SectionAccordion({ node, level }) {
  return (
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
}

SectionAccordion.propTypes = {
  node: nodePropType.isRequired,
  level: PropTypes.number,
};

SectionAccordion.defaultProps = {
  level: 0,
};

export default SectionAccordion;