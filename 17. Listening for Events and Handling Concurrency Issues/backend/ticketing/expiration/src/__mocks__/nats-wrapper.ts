export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: (err: string) => void) => {
          callback("");
        }
      ),
  },
};
