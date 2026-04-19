import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { ChevronLeft, Heart, Info, Bookmark, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function FoodRecommendationsScreen() {
  const router = useRouter();
  const [cyclePhase, setCyclePhase] = useState('Menstruation');
  const [savedRecipes, setSavedRecipes] = useState([]);
  
  // Food recommendations based on cycle phase
  const foodRecommendations = {
    'Menstruation': {
      title: 'Foods for Menstruation Phase',
      description: 'During your period, focus on iron-rich foods to replenish lost blood and anti-inflammatory foods to reduce cramps and discomfort.',
      recommended: [
        {
          id: 1,
          name: 'Iron-Rich Foods',
          description: 'Replenish iron lost during menstruation',
          examples: 'Spinach, lentils, tofu, red meat, pumpkin seeds',
          image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          benefits: ['Prevents anemia', 'Reduces fatigue', 'Supports oxygen transport']
        },
        {
          id: 2,
          name: 'Anti-Inflammatory Foods',
          description: 'Reduce inflammation and pain',
          examples: 'Turmeric, ginger, berries, fatty fish, olive oil',
          image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          benefits: ['Reduces cramps', 'Decreases bloating', 'Alleviates back pain']
        },
        {
          id: 3,
          name: 'Magnesium-Rich Foods',
          description: 'Helps reduce muscle tension and cramps',
          examples: 'Dark chocolate, avocados, nuts, bananas, whole grains',
          image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          benefits: ['Eases muscle cramps', 'Improves mood', 'Supports sleep']
        }
      ],
      avoid: [
        'Caffeine (can increase cramps and breast tenderness)',
        'Alcohol (can worsen dehydration and mood swings)',
        'Salty foods (can increase bloating and water retention)',
        'Processed sugar (can worsen mood swings and inflammation)'
      ],
      recipes: [
        {
          id: 101,
          title: 'Iron-Boosting Spinach and Lentil Soup',
          image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          time: '30 min',
          difficulty: 'Easy'
        },
        {
          id: 102,
          title: 'Anti-Inflammatory Turmeric Smoothie',
          image: 'https://images.unsplash.com/photo-1638280346622-57c85e6969e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          time: '5 min',
          difficulty: 'Easy'
        },
        {
          id: 103,
          title: 'Magnesium-Rich Dark Chocolate Avocado Mousse',
          image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          time: '15 min',
          difficulty: 'Easy'
        }
      ]
    },
    'Follicular Phase': {
      title: 'Foods for Follicular Phase',
      description: 'During the follicular phase, estrogen rises and your energy increases. Focus on foods that support liver function to metabolize estrogen and provide sustained energy.',
      recommended: [
        {
          id: 4,
          name: 'Fermented Foods',
          description: 'Support gut health and estrogen metabolism',
          examples: 'Kimchi, sauerkraut, kefir, kombucha, yogurt',
          image: 'https://images.unsplash.com/photo-1603803721487-97009eb7f8d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          benefits: ['Improves digestion', 'Supports estrogen metabolism', 'Enhances immune function']
        },
        {
          id: 5,
          name: 'Antioxidant-Rich Foods',
          description: 'Support cellular health and hormone balance',
          examples: 'Berries, citrus fruits, bell peppers, green tea',
          image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          benefits: ['Reduces oxidative stress', 'Supports egg health', 'Improves skin']
        },
        {
          id: 6,
          name: 'Complex Carbohydrates',
          description: 'Provide sustained energy during this active phase',
          examples: 'Sweet potatoes, quinoa, oats, brown rice, beans',
          image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          benefits: ['Stabilizes blood sugar', 'Provides sustained energy', 'Supports brain function']
        }
      ],
      avoid: [
        'Processed foods (can disrupt hormone balance)',
        'Excessive alcohol (can impair liver function)',
        'Refined sugar (can cause energy crashes)',
        'Artificial additives (can stress the liver)'
      ],
      recipes: [
        {
          id: 104,
          title: 'Probiotic Breakfast Bowl with Kefir and Berries',
          image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          time: '10 min',
          difficulty: 'Easy'
        },
        {
          id: 105,
          title: 'Quinoa Power Bowl with Roasted Vegetables',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          time: '25 min',
          difficulty: 'Medium'
        },
        {
          id: 106,
          title: 'Antioxidant Green Smoothie',
          image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          time: '5 min',
          difficulty: 'Easy'
        }
      ]
    },
    'Ovulation': {
      title: 'Foods for Ovulation Phase',
      description: 'During ovulation, focus on foods that support hormone production and egg health. This is also a good time to include foods that boost libido and fertility.',
      recommended: [
        {
          id: 7,
          name: 'Zinc-Rich Foods',
          description: 'Support egg health and hormone production',
          examples: 'Oysters, pumpkin seeds, chickpeas, cashews, eggs',
          image: 'https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          benefits: ['Supports egg health', 'Enhances immune function', 'Aids in cell division']
        },
        {
          id: 8,
          name: 'Healthy Fats',
          description: 'Essential for hormone production',
          examples: 'Avocados, olive oil, nuts, seeds, fatty fish',
          image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          benefits: ['Supports hormone production', 'Reduces inflammation', 'Improves nutrient absorption']
        },
        {
          id: 9,
          name: 'Vitamin E Foods',
          description: 'Supports the luteal phase and progesterone production',
          examples: 'Sunflower seeds, almonds, spinach, broccoli',
          image: 'https://images.unsplash.com/photo-1573851552153-816785fecf4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          benefits: ['Supports uterine lining', 'Acts as an antioxidant', 'Improves blood flow']
        }
      ],
      avoid: [
        'Processed meats (contain additives that can affect hormones)',
        'Trans fats (can increase inflammation)',
        'Excessive caffeine (can affect fertility)',
        'Low-fat diets (healthy fats are essential for hormone production)'
      ],
      recipes: [
        {
          id: 107,
          title: 'Fertility-Boosting Salmon with Avocado Salsa',
          image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          time: '20 min',
          difficulty: 'Medium'
        },
        {
          id: 108,
          title: 'Zinc-Rich Oyster and Spinach Stir Fry',
          image: 'https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          time: '15 min',
          difficulty: 'Medium'
        },
        {
          id: 109,
          title: 'Hormone-Balancing Buddha Bowl',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          time: '30 min',
          difficulty: 'Medium'
        }
      ]
    },
    'Luteal Phase': {
      title: 'Foods for Luteal Phase',
      description: 'During the luteal phase, progesterone rises and you may experience PMS symptoms. Focus on foods that balance blood sugar, support serotonin production, and reduce inflammation.',
      recommended: [
        {
          id: 10,
          name: 'Vitamin B6-Rich Foods',
          description: 'Helps reduce PMS symptoms and supports mood',
          examples: 'Chicken, turkey, potatoes, bananas, pistachios',
          image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          benefits: ['Reduces PMS symptoms', 'Supports serotonin production', 'Balances mood']
        },
        {
          id: 11,
          name: 'Calcium-Rich Foods',
          description: 'Helps reduce mood swings and cramps',
          examples: 'Yogurt, kale, sardines, sesame seeds, fortified plant milks',
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          benefits: ['Reduces cramps', 'Improves mood', 'Supports bone health']
        },
        {
          id: 12,
          name: 'Tryptophan-Rich Foods',
          description: 'Supports serotonin production for better mood',
          examples: 'Turkey, eggs, cheese, pineapple, tofu, salmon',
          image: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          benefits: ['Improves mood', 'Supports sleep', 'Reduces anxiety']
        }
      ],
      avoid: [
        'Caffeine (can worsen anxiety and breast tenderness)',
        'Alcohol (can disrupt sleep and worsen mood swings)',
        'High-sodium foods (can increase bloating and water retention)',
        'Refined carbohydrates (can cause blood sugar spikes and crashes)'
      ],
      recipes: [
        {
          id: 110,
          title: 'Mood-Boosting Turkey and Sweet Potato Bowl',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          time: '25 min',
          difficulty: 'Medium'
        },
        {
          id: 111,
          title: 'PMS-Fighting Kale and Sesame Salad',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          time: '15 min',
          difficulty: 'Easy'
        },
        {
          id: 112,
          title: 'Serotonin-Boosting Pineapple Smoothie Bowl',
          image: 'https://images.unsplash.com/photo-1501746877-14782df58970?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          time: '10 min',
          difficulty: 'Easy'
        }
      ]
    }
  };
  
  // Get current recommendations based on cycle phase
  const currentRecommendations = foodRecommendations[cyclePhase] || foodRecommendations['Menstruation'];
  
  const toggleSaveRecipe = (recipeId) => {
    if (savedRecipes.includes(recipeId)) {
      setSavedRecipes(savedRecipes.filter(id => id !== recipeId));
    } else {
      setSavedRecipes([...savedRecipes, recipeId]);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Recommendations</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.phaseSelector}>
          {Object.keys(foodRecommendations).map((phase) => (
            <TouchableOpacity
              key={phase}
              style={[
                styles.phaseButton,
                cyclePhase === phase && styles.phaseButtonActive
              ]}
              onPress={() => setCyclePhase(phase)}
            >
              <Text
                style={[
                  styles.phaseButtonText,
                  cyclePhase === phase && styles.phaseButtonTextActive
                ]}
              >
                {phase}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.phaseInfoCard}>
          <Text style={styles.phaseTitle}>{currentRecommendations.title}</Text>
          <Text style={styles.phaseDescription}>{currentRecommendations.description}</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Recommended Food Groups</Text>
        
        {currentRecommendations.recommended.map((food) => (
          <View key={food.id} style={styles.foodCard}>
            <Image source={{ uri: food.image }} style={styles.foodImage} />
            <View style={styles.foodContent}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodDescription}>{food.description}</Text>
              <Text style={styles.foodExamples}>
                <Text style={{ fontWeight: 'bold' }}>Examples: </Text>
                {food.examples}
              </Text>
              
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>Benefits:</Text>
                {food.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Heart size={14} color="#FF6B8B" style={{ marginRight: 5 }} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
        
        <View style={styles.avoidSection}>
          <View style={styles.avoidHeader}>
            <Info size={20} color="#FF6B8B" />
            <Text style={styles.avoidTitle}>Foods to Limit</Text>
          </View>
          
          {currentRecommendations.avoid.map((item, index) => (
            <View key={index} style={styles.avoidItem}>
              <Text style={styles.avoidText}>• {item}</Text>
            </View>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Recommended Recipes</Text>
        
        <View style={styles.recipesContainer}>
          {currentRecommendations.recipes.map((recipe) => (
            <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
              <View style={styles.recipeContent}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <View style={styles.recipeMetaContainer}>
                  <Text style={styles.recipeMeta}>{recipe.time}</Text>
                  <Text style={styles.recipeMeta}>•</Text>
                  <Text style={styles.recipeMeta}>{recipe.difficulty}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.bookmarkButton}
                onPress={() => toggleSaveRecipe(recipe.id)}
              >
                <Bookmark 
                  size={20} 
                  color={savedRecipes.includes(recipe.id) ? "#FF6B8B" : "#999"}
                  fill={savedRecipes.includes(recipe.id) ? "#FF6B8B" : "transparent"}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Note: These recommendations are general guidelines. Always consult with a healthcare provider or nutritionist for personalized advice.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  phaseSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  phaseButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
    marginBottom: 10,
  },
  phaseButtonActive: {
    backgroundColor: '#FF6B8B',
  },
  phaseButtonText: {
    fontSize: 14,
    color: '#555',
  },
  phaseButtonTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  phaseInfoCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  phaseDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  foodCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  foodImage: {
    width: '100%',
    height: 150,
  },
  foodContent: {
    padding: 15,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  foodDescription: {
    fontSize: 15,
    color: '#666',
    marginBottom: 10,
  },
  foodExamples: {
    fontSize: 15,
    color: '#555',
    marginBottom: 15,
  },
  benefitsContainer: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 10,
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  benefitText: {
    fontSize: 14,
    color: '#555',
  },
  avoidSection: {
    backgroundColor: '#FFF0F3',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },
  avoidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avoidTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  avoidItem: {
    marginBottom: 8,
  },
  avoidText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  recipesContainer: {
    marginBottom: 30,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  recipeImage: {
    width: 100,
    height: 100,
  },
  recipeContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeMeta: {
    fontSize: 14,
    color: '#888',
    marginRight: 5,
  },
  bookmarkButton: {
    padding: 15,
    justifyContent: 'center',
  },
  disclaimer: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});