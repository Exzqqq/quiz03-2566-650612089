import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB()
 let roomId = null
 let roomName = null
  var totalRooms =0;
  const room = [];

  for (const x of DB.rooms) {
    totalRooms++
  }
  return NextResponse.json({
    ok: true,
    rooms: DB.rooms,
    totalRooms: totalRooms
  });
};

export const POST = async (request) => {

  const payload = checkToken(request);

  
  if (!payload.role) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();
  const body = await request.json();
  const { roomName } = body

  // Check if the room with the same name already exists
  const createdRoom = DB.rooms.find(x => x.roomName ===roomName)

  if (createdRoom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room '${roomName}' already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();
  writeDB();
  DB.rooms.push({ roomId, name: roomName });


  return NextResponse.json({
    ok: true,
    roomId: roomId,
    message: `Room '${roomName}' has been created`,
  });
};
