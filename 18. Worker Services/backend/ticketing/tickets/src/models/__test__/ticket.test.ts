import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  // Create an instance of a ticket
  const ticket = new Ticket({ title: "concert", price: 5, userId: "123" });

  // Save the ticket to the database

  await ticket.save();

  // Fetch the ticket twice

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two seperate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save the first fetched ticket

  await firstInstance!.save();

  // save the second fetched ticket and expect an error

  // doesnt work expected sometimes
  //   expect(async () => {
  //     await secondInstance!.save();
  //   }).toThrow();

  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
  // Create an instance of a ticket
  const ticket = new Ticket({ title: "concert", price: 5, userId: "123" });

  // Save the ticket to the database
  await ticket.save();

  // Check version flag
  expect(ticket.version).toEqual(0);

  // Update the ticket
  ticket.set({ price: 10 });

  await ticket.save();

  // Check version flag

  expect(ticket.version).toEqual(1);

  // Update the ticket
  ticket.set({ price: 15 });

  await ticket.save();

  // Check version flag

  expect(ticket.version).toEqual(2);

  // Save and check version flag
  await ticket.save();

  expect(ticket.version).toEqual(3);
});
