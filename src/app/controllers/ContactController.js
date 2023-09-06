const ContactsRepository = require('../repositories/ContactsRepository');
const isValidUUID = require('../utils/isValidUUID')

class ContactController {
  async index(request, response) {
    // Listar todos os registros
    const { orderBy } = request.query;
    const contacts = await ContactsRepository.findAll(orderBy);


    response.json(contacts);
  }

  async show(request, response) {
    // Obter UM registros
    const { id } = request.params;

    if(!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid user id' })
    }

    const contact = await ContactsRepository.findById(id);

    if(!contact) {
      return response.status(404).json({ error: 'Contact not found' });
    }

    response.json(contact);

  }

  async store(request, response) {
    // Criar novo registro
    const { name, email, phone, category_id } = request.body;

    if(!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    if(category_id && !isValidUUID(category_id)) {
      return response.status(400).json({ error: 'Invalid category' })
    }

    if(email) {
      const contactsExists = await ContactsRepository.findByEmail(email);
      if(contactsExists) {
        return response.status(400).json({ error: 'This e-mail already in use' });
      }
    }



    const contact = await ContactsRepository.create({
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
    });


    response.status(201).json(contact);
  }

  async update(request, response) {
    // Editar um registro
    const { id } = request.params;
    const { name, email, phone, category_id } = request.body;

    if(!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid user id' })
    }

    if(category_id && !isValidUUID(category_id)) {
      return response.status(400).json({ error: 'Invalid category id'})
    }

    if(!name) {
      return response.status(400).json({ erro: 'Name is required' });
    }

    const contactsExists = await ContactsRepository.findById(id);
    if(!contactsExists) {
      return response.status(404).json({ erro: 'User not found'});
    }

    if(email) {
      const contactByEmail = await ContactsRepository.findByEmail(email);
      if(contactByEmail && contactByEmail.id !== id) {
        return response.status(400).json({ erro: 'This e-mail already in use' });
      }
    }


    const contact = await ContactsRepository.update(id, {
      name,
      email: email || null,
      phone,
      category_id: category_id || null
    });

    response.json(contact);

  }

  async delete(request, response) {
    // Deletar um registro
    const { id } = request.params;

    if(!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid contact id' })
    }

    await ContactsRepository.delete(id);

    response.sendStatus(204);
  }
}


// Singleton
module.exports = new ContactController();
