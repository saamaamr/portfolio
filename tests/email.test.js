const {
  getTransportOptions,
  sendWithRetry,
  sendContactEmail,
} = require('../services/email');

describe('Email service', () => {
  it('builds a pooled SMTP transport from environment configuration', () => {
    expect(
      getTransportOptions({
        SMTP_HOST: 'smtp.example.com',
        SMTP_PORT: '465',
        SMTP_USER: 'portfolio@example.com',
        SMTP_PASS: 'secret',
      })
    ).toEqual({
      host: 'smtp.example.com',
      port: 465,
      secure: true,
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 4000,
      rateLimit: 14,
      auth: {
        user: 'portfolio@example.com',
        pass: 'secret',
      },
    });
  });

  it('stops retrying after three total attempts', async () => {
    const attempts = [];
    const delays = [];
    const transporter = {
      async sendMail(options) {
        attempts.push(options);
        throw new Error('SMTP unavailable');
      },
    };

    await expect(
      sendWithRetry(transporter, { subject: 'Test' }, {
        sleep: async (delay) => delays.push(delay),
      })
    ).rejects.toThrow('SMTP unavailable');

    expect(attempts).toHaveLength(3);
    expect(delays).toEqual([1000, 2000]);
  });

  it('escapes contact content and tolerates an auto-reply failure', async () => {
    const deliveries = [];
    const transporter = {
      async sendMail(options) {
        deliveries.push(options);
        if (options.to === 'sender@example.com') {
          throw new Error('Recipient mailbox unavailable');
        }
        return { messageId: 'notification-id' };
      },
    };

    await expect(
      sendContactEmail(
        {
          name: '<b>Sender</b>',
          email: 'sender@example.com',
          message: '<script>alert(1)</script> A legitimate support request.',
        },
        {
          transporter,
          sleep: async () => {},
          env: {
            SMTP_USER: 'portfolio@example.com',
            CONTACT_EMAIL: 'owner@example.com',
          },
        }
      )
    ).resolves.toBeUndefined();

    const notification = deliveries.find((delivery) => delivery.to === 'owner@example.com');
    expect(notification.html).toContain('&lt;b&gt;Sender&lt;/b&gt;');
    expect(notification.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(notification.html).not.toContain('<script>');
  });
});
