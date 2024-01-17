import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

type Destructor = () => void;

export function useSocketIo(path: string, handle?: (socket: Socket) => (void | Destructor)) {

  const ref = useRef<Socket | null>(null);

  useEffect(() => {
    if (ref.current) return;

    ref.current = io(path).on('close', () => {
      ref.current = null
    });

    if (handle)
      return handle(ref.current)

  }, [handle, path]);

  return ref
}