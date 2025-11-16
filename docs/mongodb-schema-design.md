# MongoDB Schema Design for Calorie Tracking Application

## Current Issue
Single `cal_log` collection with all users' meals - this will cause performance issues at scale.

## Recommended Approach: Hybrid Pattern

### 1. **Collections Structure**

#### **users** Collection
```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  fullName: "יוסי קריכלי",
  passwordHash: "...",
  age: 37,
  height: 182,
  weight: 89,
  sex: "זכר",
  workoutDays: "3-4",
  goal: "גירעון קלורי",
  referralSource: "Crossfit Savoy",
  dailyCalorieGoal: 2000,
  createdAt: ISODate("2024-01-15T10:00:00Z"),
  emailVerified: false,
  // Denormalized current stats for quick access
  currentStats: {
    todayCalories: 1250,
    weekCalories: 8750,
    lastMealAt: ISODate("2024-01-15T18:30:00Z")
  }
}
```

#### **meals** Collection (Bucketed by Day)
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."), // Reference to user
  date: ISODate("2024-01-15T00:00:00Z"), // Midnight of the day
  totalCalories: 1850, // Denormalized daily total
  meals: [
    {
      mealId: ObjectId("..."),
      name: "סלט קינואה",
      calories: 320,
      emoji: "🥗",
      consumedAt: ISODate("2024-01-15T12:30:00Z"),
      createdAt: ISODate("2024-01-15T12:31:00Z")
    },
    {
      mealId: ObjectId("..."),
      name: "שייק חלבון",
      calories: 210,
      emoji: "🥤",
      consumedAt: ISODate("2024-01-15T16:00:00Z"),
      createdAt: ISODate("2024-01-15T16:01:00Z")
    }
    // ... more meals for this day
  ],
  mealCount: 5,
  lastUpdated: ISODate("2024-01-15T20:30:00Z")
}
```

### 2. **Indexing Strategy**

```javascript
// users collection indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })

// meals collection indexes
db.meals.createIndex({ userId: 1, date: -1 }, { unique: true })
db.meals.createIndex({ date: -1 })
db.meals.createIndex({ "meals.consumedAt": -1 })

// Compound index for common queries
db.meals.createIndex({ 
  userId: 1, 
  "meals.consumedAt": -1 
})
```

### 3. **Query Patterns**

#### Add a New Meal
```javascript
// Using upsert to create day bucket if it doesn't exist
db.meals.updateOne(
  { 
    userId: ObjectId("..."),
    date: ISODate("2024-01-15T00:00:00Z") // Today at midnight
  },
  {
    $push: {
      meals: {
        mealId: ObjectId(),
        name: "סלט ירקות",
        calories: 150,
        emoji: "🥗",
        consumedAt: new Date(),
        createdAt: new Date()
      }
    },
    $inc: { 
      totalCalories: 150,
      mealCount: 1 
    },
    $set: { 
      lastUpdated: new Date() 
    }
  },
  { upsert: true }
)

// Also update user's current stats
db.users.updateOne(
  { _id: ObjectId("...") },
  {
    $inc: { "currentStats.todayCalories": 150 },
    $set: { "currentStats.lastMealAt": new Date() }
  }
)
```

#### Get Today's Meals
```javascript
db.meals.findOne({
  userId: ObjectId("..."),
  date: {
    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
    $lt: new Date(new Date().setHours(23, 59, 59, 999))
  }
})
```

#### Get Weekly Stats
```javascript
db.meals.aggregate([
  {
    $match: {
      userId: ObjectId("..."),
      date: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }
  },
  {
    $group: {
      _id: null,
      totalCalories: { $sum: "$totalCalories" },
      totalMeals: { $sum: "$mealCount" },
      avgDailyCalories: { $avg: "$totalCalories" }
    }
  }
])
```

### 4. **Scaling Strategies**

#### **A. Sharding (For Very Large Scale)**
```javascript
// Shard by userId for even distribution
sh.shardCollection("mydb.meals", { userId: "hashed" })

// Alternative: Shard by compound key for better locality
sh.shardCollection("mydb.meals", { userId: 1, date: 1 })
```

#### **B. Time-Series Optimization**
For MongoDB 5.0+, consider using time-series collections:
```javascript
db.createCollection("meal_events", {
  timeseries: {
    timeField: "consumedAt",
    metaField: "userId",
    granularity: "minutes"
  }
})
```

#### **C. Archival Strategy**
```javascript
// Move old data to archive collection after 1 year
db.meals.aggregate([
  {
    $match: {
      date: { $lt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
    }
  },
  { $out: "meals_archive" }
])
```

### 5. **Alternative Patterns**

#### **Pattern 1: One Document Per Meal** (Simple but less efficient)
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  name: "סלט קינואה",
  calories: 320,
  emoji: "🥗",
  consumedAt: ISODate("2024-01-15T12:30:00Z"),
  dayKey: "2024-01-15", // For daily aggregations
  weekKey: "2024-W03", // For weekly aggregations
  monthKey: "2024-01" // For monthly aggregations
}
```

#### **Pattern 2: User-Embedded Pattern** (Good for small data sets)
```javascript
// In users collection
{
  _id: ObjectId("..."),
  email: "user@example.com",
  // ... user fields
  recentMeals: [ // Keep last 100 meals
    {
      mealId: ObjectId("..."),
      name: "סלט קינואה",
      calories: 320,
      consumedAt: ISODate("...")
    }
    // ... up to 100 meals
  ],
  mealHistory: [ // Bucketed by month
    {
      month: "2024-01",
      totalCalories: 58500,
      mealCount: 93,
      avgDaily: 1887
    }
  ]
}
```

### 6. **Performance Considerations**

1. **Document Size**: Keep documents under 16MB (MongoDB limit)
2. **Bucket Size**: Aim for ~100-200 meals per document (day bucket usually contains 3-10 meals)
3. **Index Size**: Monitor index size, keep working set in RAM
4. **Write Patterns**: Use bulk operations for multiple meal additions
5. **Read Patterns**: Optimize for most common queries (today's meals, weekly stats)

### 7. **Migration Strategy**

```javascript
// Script to migrate from single collection to bucketed pattern
db.cal_log.aggregate([
  {
    $group: {
      _id: {
        userId: "$userId",
        date: {
          $dateFromParts: {
            year: { $year: "$consumedAt" },
            month: { $month: "$consumedAt" },
            day: { $dayOfMonth: "$consumedAt" }
          }
        }
      },
      meals: {
        $push: {
          mealId: "$_id",
          name: "$name",
          calories: "$calories",
          emoji: "$emoji",
          consumedAt: "$consumedAt"
        }
      },
      totalCalories: { $sum: "$calories" },
      mealCount: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      userId: "$_id.userId",
      date: "$_id.date",
      meals: 1,
      totalCalories: 1,
      mealCount: 1,
      lastUpdated: new Date()
    }
  },
  { $out: "meals" }
])
```

## Recommended Approach for Your Use Case

Given your calorie tracking application, I recommend:

1. **Use the Bucketed Pattern** (meals collection with daily buckets)
   - Balances performance with simplicity
   - Natural fit for daily calorie tracking
   - Efficient for common queries

2. **Key Benefits**:
   - Reduced index size (fewer documents)
   - Better cache utilization
   - Atomic daily updates
   - Easy daily/weekly/monthly aggregations
   - Supports millions of users

3. **Start Simple**:
   - Begin with bucketed pattern
   - Add sharding when you reach 100K+ active users
   - Consider time-series collections for analytics

4. **Monitoring**:
   - Track document sizes
   - Monitor query performance
   - Watch index usage
   - Set up alerts for slow queries
