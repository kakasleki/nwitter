import { authService, dbService } from "fbase";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nweet from "../components/Nweet";

const Profile = ({ userObj }) => {
    const history = useNavigate();
    const [nweets, setNweets] = useState([]);

    const onLogOutClick = () => {
        authService.signOut();
        history("/");
    };

    const getMyNweets = async () => {
        return await dbService
            .collection("nweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createdAt", "asc")
            .get();

        //console.log(nweets.docs.map((doc) => doc.data()));
    };

    useEffect(() => {
        getMyNweets().then(function (data) {
            const newArray = data.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setNweets(newArray);
        });
    }, []);

    return (
        <>
            <button onClick={onLogOutClick}>Log Out</button>

            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                ))}
            </div>
        </>
    );
};

export default Profile;