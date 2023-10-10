import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllRooms } from "../../api/rooms";
import Heading from "../Heading/Heading";
import Container from "../Shared/Container/Container";
import Loader from "../Shared/Loader/Loader";
import Card from "./Card";

const Rooms = () => {
  const [params, setParams] = useSearchParams();
  const category = params.get("category");
  // console.log(category);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
      getAllRooms()
      .then((data) => {
        if (category) {
          const filtered = data.filter((room) => room.category === category);
          setRooms(filtered);
        } 
        else {
          setRooms(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [category]);
  if (loading) {
    return <Loader />;
  }
  return (
    <Container>
       {
        rooms && rooms.length > 0 ? (<div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {rooms.map((room, index) => (
          <Card key={index} room={room}></Card>
        ))}
      </div>) : (
        <div className="pt-12">
            <Heading 
            title="No Rooms Available in this category"
            subtitle="Please select other categories"
            center={true}
            ></Heading>
             
        </div>
      )
       }
    </Container>
  );
};

export default Rooms;
