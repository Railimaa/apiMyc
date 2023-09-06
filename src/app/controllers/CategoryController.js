const CategoriesRepository = require('../repositories/CategoriesRepository');

class CategoryController {
  async index(request, response) {
    const categories = await CategoriesRepository.findAll();

    response.json(categories);
  }

  async show(request, response) {
    const { id } = request.params;

    const categorie = await CategoriesRepository.findByCategory(id);

    if(!categorie) {
      return response.status(404).json({ error: 'Category not found' });
    }

    response.json(categorie);
  }

  async store(request, response) {
    const { name } = request.body;

    if(!name) {
      return response.status(400).json({ erro: 'Name is required' });
    }

    const category = await CategoriesRepository.create({ name });

    response.status(201).json(category);
  }

  async delete(request, response) {
    const { id } = request.params;

    await CategoriesRepository.delete(id);
    response.send(204);

  }

  async update(request, response) {
    const { id } = request.params;
    const { name } = request.body;

    const categoryExists = await CategoriesRepository.findByCategory(id);

    if(!categoryExists) {
      return response.status(404).json({ error: 'Category Not Found' });
    }

    if(!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const categorie = await CategoriesRepository.update(id, { name });

    response.json(categorie);
  }


}

module.exports = new CategoryController();
