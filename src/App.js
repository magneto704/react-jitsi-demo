import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const App = () => {
  const [displayName, setDisplayName] = React.useState("วิชัย บุบผามะตะนัง");
  const [muted, setMuted] = React.useState(false);
  const [api, setApi] = React.useState(null);
  const [participantsInfo, setParticipantsInfo] = React.useState(null);

  const handleExcuteCommand = (command) => {
    api.executeCommand(command);
  };

  // open dialog
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {!open && (
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item container spacing={2} xs={10}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  สถานะไมค์ : {muted ? "เปิดไมค์" : "ปิดไมค์"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <JitsiMeeting
                  domain={`testjitsi.ddns.net`}
                  roomName="react_demo"
                  configOverwrite={{
                    startWithAudioMuted: true,
                    disableModeratorIndicator: false,
                    startScreenSharing: true,
                    enableEmailInStats: false,
                    disableSelfView: false,
                    apiLogLevels: ["warn"],
                    filmstrip: {
                      disableResizable: true,
                      disableStageFilmstrip: true,
                      disableFilmstripAutohiding: false,
                      doNotFlipLocalVideo: true,
                    },
                  }}
                  spinner={() => <h1>รอสักครู่....</h1>}
                  interfaceConfigOverwrite={{
                    VIDEO_LAYOUT_FIT: "nocrop",
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    // TILE_VIEW_MAX_COLUMNS: 1,
                    CLOSE_PAGE_GUEST_HINT: true,
                    HIDE_INVITE_MORE_HEADER: true,
                    // DEFAULT_BACKGROUND: "#BDF0FF",
                    // VERTICAL_FILMSTRIP: false,
                  }}
                  userInfo={{
                    email: "wichai.b@lexnetix.co.th",
                    displayName,
                  }}
                  onApiReady={async (externalApi) => {
                    externalApi.on("audioMuteStatusChanged", (state) => {
                      setMuted(!state.muted);
                    });

                    externalApi.

                    externalApi.on("raiseHandUpdated", (state) => {
                      alert("มีผู้ประท้วง");
                    });

                    // const displayName = externalApi.getDisplayName(participantId);
                    // console.log(displayName);

                    externalApi.executeCommand(
                      "avatarUrl",
                      "https://i.pinimg.com/236x/cf/74/1a/cf741a56f200041630642387a61ac31c.jpg"
                    );
                    externalApi.executeCommand("overwriteConfig", {
                      toolbarButtons: [],
                    });

                    // here you can attach custom event listeners to the Jitsi Meet External API
                    // you can also store it locally to execute commands
                    setApi(externalApi);

                    const api = await externalApi.getParticipantsInfo();
                    console.warn(api);
                  }}
                  getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = "80vh";
                  }}
                />
              </Grid>
              <Grid item xs={12} container columnGap={2}>
                <Button
                  variant="contained"
                  onClick={() => handleExcuteCommand("toggleVideo")}
                >
                  ปิด/เปิด กล้อง
                </Button>

                <Button
                  variant="contained"
                  onClick={() => {
                    handleExcuteCommand("toggleAudio");
                    // handleExcuteCommand("toggleSubtitles");
                  }}
                >
                  ปิด/เปิด ไมค์
                </Button>

                <Button
                  variant="contained"
                  onClick={() => handleExcuteCommand("toggleFilmStrip")}
                >
                  ปิด/เปิด ผู้ประชุม
                </Button>

                <Button
                  variant="contained"
                  onClick={() => handleExcuteCommand("toggleRaiseHand")}
                >
                  ยกมือ
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <List>
                {(participantsInfo ? participantsInfo.participants : []).map(
                  (data, index) => {
                    return (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={data.displayName}
                            secondary={data.id}
                          />
                        </ListItem>
                      </React.Fragment>
                    );
                  }
                )}
              </List>
            </Grid>
          </Grid>
        </Container>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="body1">ตั้งค่าใช้งานระบบ</Typography>
        </DialogTitle>
        <DialogContent sx={{ width: "550px" }}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={9} md={10}>
              <TextField
                placeholder="ระบุชื่อ"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={3} md={2}>
              <Button
                variant="contained"
                sx={{ height: "50px", width: "80px" }}
                onClick={() => {
                  if (displayName == "") {
                    alert("ระบุข้อมูลชื่อผู้ใช้งาน!");
                  } else {
                    setOpen(false);
                  }
                }}
              >
                <Typography variant="body1">ตกลง</Typography>
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default App;
