import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import { red } from '@mui/material/colors';
import { Handle, Position } from '@xyflow/react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '../stylesheets/CustomNode.css';  // External CSS

const CustomNode = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Left} />

      <Card className="custom-node-card">
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="node-avatar">
              TB
            </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={data.onOpenMenu}>
              <MoreVertIcon />
            </IconButton>
          }
          title={
            <Typography variant="body2" className="custom-node-title">
              {data.label}
            </Typography>
          }
        />

        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            Node description or additional information here.
          </Typography>
        </CardContent>

        <CardActions disableSpacing>
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            className={`custom-node-expand ${expanded ? 'expanded' : ''}`}
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography>Details about this node:</Typography>
            <Typography>
              This is some additional information that appears when the node is expanded.
            </Typography>
            <Typography>
              You can include any details or more fields here that you want to show when expanded.
            </Typography>
          </CardContent>
        </Collapse>
      </Card>

      <Handle type="source" position={Position.Right} id="a" />
    </div>
  );
};

export default CustomNode;
