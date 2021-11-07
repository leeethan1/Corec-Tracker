import { React, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Header from "./Header";
import { Alert, Button } from "react-bootstrap";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { rememberUser } from "./Login";

function Favorites() {
  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const [authError, setAuthError] = useState(false);
  const history = useHistory();

  async function handleGetFavorites() {
    const token = localStorage.getItem("remember")
      ? localStorage.getItem("access")
      : sessionStorage.getItem("access");
    console.log(token);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access: token,
      },
    };
    const response = await fetch(`/favorites/get`, requestOptions);
    if (response.ok) {
      const res = await response.json();
      const o = res.rooms;
      //console.log(averages);
      setFavoriteRooms(o);
      //console.log(occupancies);
    } else {
      setAuthError(true);
    }
  }

  useEffect(() => {
    handleGetFavorites();
  }, []);

  function displayFavoriteRooms() {
    if (authError) {
      return (
        <div>
          <Alert
            onClose={() => setAuthError(false)}
            dismissible={false}
            show={authError}
            key={0}
            variant="danger"
          >
            <Alert.Heading>
              Oops! It seems like you're not logged in.
            </Alert.Heading>
            <p>
              You can <Alert.Link href="/">log in</Alert.Link> if you already
              have an account or{" "}
              <Alert.Link href="/signup">create an account</Alert.Link>.
            </p>
          </Alert>
        </div>
      );
    }
    if (favoriteRooms.length > 0) {
      let rowsToRender = [];
      favoriteRooms.forEach((item) => {
        rowsToRender.push(
          <div className="room-row" key={item}>
            <hr />
            <Link
              to={{
                pathname: "/room/" + encodeURIComponent(item),
              }}
            >
              {item}
            </Link>
            <hr />
          </div>
        );
      });
      return rowsToRender;
    } else {
      return <h3>Looks like you don't have any favorite rooms yet</h3>;
    }
  }

  return (
    <div>
      <Header />
      <div style={{ margin: 10 }}>
        <h1>Favorite Rooms</h1>
        {displayFavoriteRooms()}
        <Button onClick={() => history.push("/dashboard")}>Back</Button>
      </div>
    </div>
  );
}

export default Favorites;
