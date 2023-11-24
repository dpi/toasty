<script setup>
import { ref, computed, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import Pusher from 'pusher-js'
import { formatDistanceToNowStrict } from 'date-fns'

const Config = window.PusherConfiguration

// https://github.com/pusher/pusher-js#configuration
const pusherOptions = {
  cluster: Config.options.cluster,
}

pusherOptions.wsHost = Config.options?.wsHost;
pusherOptions.wsPort = Config.options?.wsPort;
pusherOptions.wssPort = Config.options?.wssPort;
pusherOptions.forceTLS = Config.options?.forceTLS;
pusherOptions.enableStats = Config.options?.enableStats;
pusherOptions.enabledTransports = Config.options?.enabledTransports;

const endpoint = Config.options.userAuthentication?.endpoint
if (endpoint) {
  pusherOptions.userAuthentication = {
    endpoint: Config.options.userAuthentication?.endpoint
  }
}
const pusher = new Pusher(Config.appKey, pusherOptions);

pusher.signin()

// https://pusher.com/docs/channels/using_channels/events/#binding-on-the-user-object
pusher.user.bind('bus-logs', (data) => {
  if (Config.toastyDebug === true) {
    debugMessages.value.push(JSON.stringify(data))
  }
  messages.value.push(data)
})

const messages = ref([])
const debugMessages = ref([])
// Tracks when 2 messages were in the list. Returns to false when all messages
// are closed.
const multiple = ref(false)
const show = ref(false)
const latest = computed(() => {
  return messages.value[messages.value.length - 1]
})

watch(latest, async (newValue, oldValue) => {
  if (messages.value.length === 0) {
    multiple.value = false
    show.value = false
  }

  if (oldValue === undefined) {
    show.value = true
  }

  if (messages.value.length >= 2) {
    // Track when there are at least two items.
    multiple.value = true
  }
})

const closeIt = () => {
  show.value = false
  messages.value.pop()

  // In a short period, check if there are any messages left, then show again.
  setTimeout(() => {
    show.value = messages.value.length > 0
  }, 300)
}

const dismissAll = () => {
  messages.value = []
}

const formatSince = (a, b) => {
  return formatDistanceToNowStrict(a, {
    addSuffix: 'ago'
  })
}

const gotoLink = (link) => {
  show.value = false
  window.location.href = link.url
}
</script>

<template>
  <div
    v-if="debugMessages.length > 0"
    class="pointer-events-none fixed inset-x-0 bottom-0 sm:flex sm:justify-center sm:px-6 sm:pb-5 lg:px-8"
  >
    <div
      class="pointer-events-auto flex items-center justify-between gap-x-6 bg-gray-900 px-6 py-2.5 sm:rounded-xl sm:py-3 sm:pl-4 sm:pr-3.5 border-2 border-lime-400 shadow-2xl shadow-black drop-shadow"
    >
      <ul class="text-white">
        <li v-for="message in debugMessages" class="text-xs">
          <code>{{ message }}</code>
        </li>
      </ul>

      <button type="button" class="-m-1.5 flex-none p-1.5" @click="debugMessages = []">
        <span class="sr-only">Dismiss</span>
        <svg class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
          />
        </svg>
      </button>
    </div>
  </div>

  <div
    aria-live="assertive"
    class="toasty-container"
  >
    <div class="toasty-container-inner">
      <transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="show"
          class="toasty-container-inner-inner"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900 my-0">
                  {{ latest?.title }}
                  <span class="text-gray-300 pl-3">
                    <timeago
                      :datetime="latest?.date * 1000"
                      :auto-update="1"
                      :converter="formatSince"
                    />
                  </span>
                </p>
                <p
                  class="mt-1 text-sm text-gray-500"
                  v-if="latest?.description !== undefined && latest?.description.length > 0"
                >
                  {{ latest?.description }}
                </p>
                <div class="mt-4 flex flex-wrap gap-3" v-if="latest?.links.length">
                  <button
                    v-for="link in latest?.links"
                    @click="gotoLink(link)"
                    type="button"
                    class="action-btn"
                  >
                    {{ link.title }}
                  </button>
                </div>

                <Transition>
                  <div class="mt-4 flex" v-if="multiple && messages.length - 1 > 0">
                    <span class="text-xs text-gray-500 mr-3">
                      {{ messages.length - 1 }}
                      <template v-if="messages.length - 1 !== 1">messages</template>
                      <template v-else>message</template>
                      remaining
                    </span>

                    <button
                      @click="dismissAll"
                      type="button"
                      class="inline-flex items-center rounded-md bg-white px-2.5 text-xs text-gray-500 shadow-sm ring-1 ring-inset hover:ring-gray-100 ring-transparent"
                    >
                      Dismiss all
                    </button>
                  </div>
                </Transition>
              </div>

              <div class="flex flex-shrink-0">
                <button
                  type="button"
                  @click="closeIt"
                  class="close-btn"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.toasty-container {
  @apply pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 hover:backdrop-blur-sm transition duration-1000;
}
.toasty-container-inner {
  @apply flex w-full flex-col items-center space-y-4 sm:items-end;
}
.toasty-container-inner-inner {
  @apply pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5;
}
.close-btn {
  @apply inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2;
}
.action-btn {
  @apply m-0 inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50;
}
</style>
