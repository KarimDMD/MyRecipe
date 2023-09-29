<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RecipeController extends Controller
{
    public function index()
    {
        $recipes = Recipe::all();
        return response()->json($recipes);;
    }

    public function indexView()
    {
        $recipes = Recipe::all();
        return view('recipes.index', compact('recipes'));
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'ingredients' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $recipe = new Recipe();
        $recipe->title = $request->input('title');
        $recipe->description = $request->input('description');
        $recipe->ingredients = $request->input('ingredients');

        $recipe->save();

        return response()->json($recipe, 201);
    }

    public function update(Request $request, $id)
    {
    }

    public function delete($id)
{
    try {
        $recipe = Recipe::findOrFail($id);
        $recipe->delete();

        return response()->json(['message' => 'Recette supprimée avec succès']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Erreur lors de la suppression de la recette'], 500);
    }
}
}
