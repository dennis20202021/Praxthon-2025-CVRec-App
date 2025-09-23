import { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

function JobCard({
  job,
  user,
  onApply,
  onEdit,
  onDelete,
  hasUserApplied,
  onCardClick,
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const totalApplicants = job.applicants ? job.applicants.length : 0;
  const isRecruiter = user?.role === "recruiter";

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(job);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    onDelete(job.jobId);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const getWorkLocationChip = (job) => {
    if (job.workLocationType) {
      const locationType = job.workLocationType.toLowerCase();
      if (locationType.includes("remote")) {
        return (
          <Chip
            label="Remote"
            size="small"
            sx={{
              ml: 1,
              color: "#4CC9F0",
              borderColor: "#4CC9F0",
              backgroundColor: "rgba(76, 201, 240, 0.1)",
              fontSize: "0.7rem",
              height: "20px",
            }}
          />
        );
      }
      if (locationType.includes("hybrid")) {
        return (
          <Chip
            label="Hybrid"
            size="small"
            sx={{
              ml: 1,
              color: "#FFD700",
              borderColor: "#FFD700",
              backgroundColor: "rgba(255, 215, 0, 0.1)",
              fontSize: "0.7rem",
              height: "20px",
            }}
          />
        );
      }
    }
    return (
      <Chip
        label="On-site"
        size="small"
        sx={{
          ml: 1,
          color: "#E94560",
          borderColor: "#E94560",
          backgroundColor: "rgba(233, 69, 96, 0.1)",
          fontSize: "0.7rem",
          height: "20px",
        }}
      />
    );
  };

  const stripHtmlTags = (html) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    const plainText = stripHtmlTags(text);
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
  };

  const userApplied = hasUserApplied(job);

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "rgba(26, 26, 46, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          color: "white",
          cursor: "pointer",
          transition: "all 0.3s ease",
          width: "335px",
          minHeight: "360px",
          maxHeight: "400px",
          overflow: "hidden",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
          },
        }}
        onClick={() => onCardClick(job)}
      >
        <CardContent sx={{ flexGrow: 1, overflow: "hidden" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: "#4CC9F0",
                flex: 1,
                fontSize: "1.25rem",
                lineHeight: "1.4",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
            >
              {job.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isRecruiter ? (
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{
                    color: "#FFD700",
                    "&:hover": {
                      backgroundColor: "rgba(255, 215, 0, 0.1)",
                    },
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              ) : (
                <IconButton
                  size="small"
                  sx={{
                    color: "#FFD700",
                    "&:hover": {
                      backgroundColor: "rgba(255, 215, 0, 0.1)",
                    },
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              )}
            </Box>
          </Box>

          <Typography
            variant="subtitle1"
            sx={{
              color: "#E94560",
              mb: 1,
              fontSize: "0.9rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {job.company} • {job.location}
            {getWorkLocationChip(job)}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontStyle: "italic",
              mb: 1,
              color: "rgba(255, 255, 255, 0.8)",
              minHeight: "40px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
            }}
          >
            {truncateText(job.description, 80)}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: 1,
              color: "rgba(255, 255, 255, 0.8)",
              minHeight: "40px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
            }}
          >
            <strong style={{ color: "#FFD700" }}>Requirements:</strong>{" "}
            {truncateText(job.requirements, 60)}
          </Typography>

          {/* Application Status Section */}
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            {user ? (
              <>
                {userApplied ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CheckCircleIcon
                      sx={{ color: "#00CC99", fontSize: "1.2rem" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#00CC99",
                        fontWeight: 500,
                        fontSize: "0.8rem",
                      }}
                    >
                      Applied ✓
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CancelIcon sx={{ color: "#E94560", fontSize: "1.2rem" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#E94560",
                        opacity: 0.8,
                        fontSize: "0.8rem",
                      }}
                    >
                      Not Applied
                    </Typography>
                  </Box>
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    ml: 1,
                    fontSize: "0.7rem",
                  }}
                >
                  ({totalApplicants} total applicant
                  {totalApplicants !== 1 ? "s" : ""})
                </Typography>
              </>
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.8rem" }}
              >
                {totalApplicants} applicant{totalApplicants !== 1 ? "s" : ""}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", mt: 2, gap: 1 }}>
            <IconButton
              size="small"
              sx={{
                color: "#0077B5",
                backgroundColor: "rgba(0, 119, 181, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(0, 119, 181, 0.2)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                color: "#FF6B35",
                backgroundColor: "rgba(255, 107, 53, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 107, 53, 0.2)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <LanguageIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                color: "#9D50BB",
                backgroundColor: "rgba(157, 80, 187, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(157, 80, 187, 0.2)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <WorkIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Typography variant="h6" sx={{ color: "#FFD700", fontSize: "1rem" }}>
            {job.salary}
          </Typography>
          <Button
            variant="contained"
            disabled={userApplied}
            sx={{
              backgroundColor: userApplied ? "#00CC99" : "#E94560",
              fontSize: "0.8rem",
              px: 1.5,
              py: 0.5,
              "&:hover": {
                backgroundColor: userApplied ? "#00B386" : "#D42A45",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(0, 204, 153, 0.3)",
                color: "white",
              },
            }}
            onClick={(e) => {
              e.stopPropagation(); // This prevents the dialog from opening
              onApply(job.jobId, job.title);
            }}
          >
            {userApplied ? "Applied" : "Apply Now"}
          </Button>
        </CardActions>
      </Card>

      {/* Edit/Delete Menu (Only for recruiters) */}
      {isRecruiter && (
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1, color: "#4CC9F0" }} />
            Edit Job
          </MenuItem>
          <MenuItem onClick={handleDeleteClick}>
            <DeleteIcon sx={{ mr: 1, color: "#E94560" }} />
            Delete Job
          </MenuItem>
        </Menu>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        sx={{
          "& .MuiDialog-paper": {
            background: "linear-gradient(135deg, #0A0A1A 0%, #16213E 100%)",
            color: "white",
          },
        }}
      >
        <DialogTitle>Delete Job</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{job.title}"? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} sx={{ color: "#4CC9F0" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{ backgroundColor: "#E94560" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default JobCard;
