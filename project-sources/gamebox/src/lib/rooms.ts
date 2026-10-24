/** Shared room contract. Production deployments should persist rooms in a server store and
 * broadcast validated actions over WebSocket/WebRTC. Never accept client scores or private hands. */
export type RoomPlayer = { id: string; name: string; connected: boolean; score: number };
export type Room<GameState = unknown> = { roomId: string; host: string; players: RoomPlayer[]; gameType: string; state: GameState; round: number; status: 'lobby'|'playing'|'finished' };
export type PlayerAction = { roomId: string; playerId: string; action: unknown };
export interface RoomAdapter {
  create(gameType: string, host: RoomPlayer): Promise<Room>;
  join(roomId: string, player: RoomPlayer): Promise<Room>;
  act(message: PlayerAction): Promise<Room>;
  subscribe(roomId: string, listener: (room: Room) => void): () => void;
}
/** Intentionally no fake network adapter: multiplayer room APIs must enforce authority server side. */
