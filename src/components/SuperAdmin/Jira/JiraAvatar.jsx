import React from 'react';
import PropTypes from 'prop-types';
import { initials, avatarColor } from 'src/services/jira/jiraBoard';

function Avatar({ name, seed, size = 26, title }) {
  return (
    <span
      className="jira-avatar"
      title={title || name || 'Unassigned'}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: name ? avatarColor(seed || name) : '#cbd5e1',
      }}
    >
      {name ? initials(name) : <i className="bi bi-person" />}
    </span>
  );
}

Avatar.propTypes = {
  name: PropTypes.string,
  seed: PropTypes.string,
  size: PropTypes.number,
  title: PropTypes.string,
};

export default Avatar;
