importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCUYhUVK-UTwSgPMZe_TR1U1EHbftwPAfE",
  authDomain: "animadores-iam.firebaseapp.com",
  projectId: "animadores-iam",
  messagingSenderId: "631574321630",
  appId: "1:631574321630:web:33dcb20a5a6bdc0725a54f",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Notificación en segundo plano:", payload); // 👈 esto
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png",
    data: payload.data,
  });
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  const link = event.notification.data?.link || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url === link && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(link);
    })
  );
});
