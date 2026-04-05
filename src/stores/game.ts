import { defineStore } from 'pinia'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { computed, ref } from 'vue'

import { useStorage } from '../composables/useStorage'
import type { User } from '../types/auth'
import type { Card } from '../types/card'

interface Room {
  id: string
  players: { id: string; username: string }[]
}

interface GameState {
  currentTurn: string
  host: string
  guest: string
  boards: Record<string, PlayerBoard>
  result?: 'win' | 'lose' | 'draw'
}

export interface PlayerBoard {
  hand: Card[]
  deck: Card[]
  active: Card | null
  score: number
}

function transformBackendGameState(payload: unknown): GameState | null {
  const state = payload.gameState || payload
  if (!state) return null

  const host = state.host
  const guest = state.guest
  if (!host || !guest) return null

  return {
    currentTurn: state.currentPlayerSocketId || '',
    host: host.socketId || '',
    guest: guest.socketId || '',
    boards: {
      [host.socketId || '']: {
        hand: host.board?.hand || [],
        deck: host.board?.deck || [],
        active: host.board?.activeCard || null,
        score: host.board?.score || 0,
      },
      [guest.socketId || '']: {
        hand: guest.board?.hand || [],
        deck: guest.board?.deck || [],
        active: guest.board?.activeCard || null,
        score: guest.board?.score || 0,
      },
    },
    result: state.result,
  }
}

export const useGameStore = defineStore('game', () => {
  const storage = useStorage()
  const token = storage.get<string>('token')
  const user = storage.get<User>('user')
  const socket = ref<Socket | null>(null)

  // Lobby state
  const rooms = ref<Room[]>([])
  const currentRoomId = ref<string | null>(null)
  const lobbyError = ref<string | null>(null)

  // Game state
  const gameState = ref<GameState | null>(null)
  const gameError = ref<string | null>(null)
  const realtimeMessage = ref<string>('En attente de la partie...')

  // Connection
  function connectSocket() {
    if (socket.value) return
    socket.value = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    })
    socket.value.on('roomsList', (list: Room[]) => {
      rooms.value = list
      realtimeMessage.value = 'Liste des rooms mise a jour.'
    })
    socket.value.on('roomsListUpdated', () => {
      realtimeMessage.value = 'Actualisation des rooms...'
      socket.value?.emit('getRooms')
    })
    socket.value.on('roomCreated', (roomId: string) => {
      currentRoomId.value = String(roomId)
      realtimeMessage.value = `Room creee: ${roomId}`
    })
    socket.value.on('roomJoined', (roomId: string) => {
      currentRoomId.value = String(roomId)
      realtimeMessage.value = `Room rejointe: ${roomId}`
    })
    socket.value.on('gameStarted', (payload: unknown) => {
      const roomId = payload?.gameState?.roomId
      if (roomId) currentRoomId.value = String(roomId)
      const state = transformBackendGameState(payload)
      if (state) gameState.value = state
      realtimeMessage.value = 'Partie demarree.'
    })
    socket.value.on('gameStateUpdated', (payload: unknown) => {
      const roomId = payload?.gameState?.roomId
      if (roomId) currentRoomId.value = String(roomId)
      const state = transformBackendGameState(payload)
      if (state) gameState.value = state
      realtimeMessage.value = 'Etat de partie mis a jour.'
    })
    socket.value.on('gameEnded', (result: string) => {
      if (gameState.value) {
        gameState.value.result = result as 'win' | 'lose' | 'draw'
      }
      realtimeMessage.value = 'Partie terminee.'
    })
    socket.value.on('opponentDisconnected', () => {
      gameError.value = "L'adversaire a quitté la partie."
      realtimeMessage.value = 'Adversaire deconnecte.'
    })
    socket.value.on('error', (err: unknown) => {
      const msg =
        typeof err === 'string' ? err : err?.message || 'Erreur inconnue'
      lobbyError.value = msg
      gameError.value = msg
      realtimeMessage.value = msg
    })
    socket.value.emit('getRooms')
  }

  // Lobby actions
  function createRoom(deckId: number) {
    socket.value?.emit('createRoom', { deckId })
  }
  function joinRoom(roomId: string, deckId: number) {
    socket.value?.emit('joinRoom', { roomId, deckId })
  }

  // Game actions
  function drawCards() {
    socket.value?.emit('drawCards', { roomId: currentRoomId.value })
    realtimeMessage.value = 'Demande: piocher.'
  }
  function playCard(cardId: number) {
    socket.value?.emit('playCard', { roomId: currentRoomId.value, cardId })
    realtimeMessage.value = 'Demande: jouer une carte.'
  }
  function attack() {
    socket.value?.emit('attack', { roomId: currentRoomId.value })
    realtimeMessage.value = 'Demande: attaquer.'
  }
  function endTurn() {
    socket.value?.emit('endTurn', { roomId: currentRoomId.value })
    realtimeMessage.value = 'Demande: fin de tour.'
  }
  function resetGame() {
    gameState.value = null
    gameError.value = null
    currentRoomId.value = null
    realtimeMessage.value = 'Retour au lobby.'
  }

  // Getters
  const isPlayerTurn = computed(() => {
    if (!gameState.value) return false
    const socketMatch = gameState.value.currentTurn === socket.value?.id
    const userMatch =
      user?.id && gameState.value.currentTurn === String(user.id)
    return !!(socketMatch || userMatch)
  })
  const playerRole = computed(() => {
    if (!gameState.value) return null
    const socketId = socket.value?.id
    const userId = user?.id ? String(user.id) : null
    if (gameState.value.host === socketId || gameState.value.host === userId)
      return 'host'
    if (gameState.value.guest === socketId || gameState.value.guest === userId)
      return 'guest'
    return null
  })
  const playerBoard = computed(() => {
    if (!gameState.value || !gameState.value.boards) return null
    const socketId = socket.value?.id
    const userId = user?.id ? String(user.id) : null
    return (
      gameState.value.boards[socketId || ''] ||
      gameState.value.boards[userId || ''] ||
      null
    )
  })
  const opponentBoard = computed(() => {
    if (!gameState.value || !gameState.value.boards) return null
    const socketId = socket.value?.id
    const userId = user?.id ? String(user.id) : null
    const myKey = socketId || userId
    const ids = Object.keys(gameState.value.boards)
    const opponentId = ids.find((id) => id !== myKey)
    return opponentId ? gameState.value.boards[opponentId] : null
  })

  const handFull = computed(
    () => !!playerBoard.value?.hand && playerBoard.value.hand.length >= 5,
  )
  const deckEmpty = computed(() => !playerBoard.value?.deck?.length)
  const playerHasActive = computed(() => !!playerBoard.value?.active)
  const opponentHasActive = computed(() => !!opponentBoard.value?.active)
  const deckCount = computed(() => playerBoard.value?.deck.length ?? 0)

  return {
    connectSocket,
    rooms,
    currentRoomId,
    lobbyError,
    createRoom,
    joinRoom,
    gameState,
    gameError,
    realtimeMessage,
    drawCards,
    playCard,
    attack,
    endTurn,
    resetGame,
    isPlayerTurn,
    playerRole,
    playerBoard,
    opponentBoard,
    handFull,
    deckEmpty,
    playerHasActive,
    opponentHasActive,
    deckCount,
  }
})
