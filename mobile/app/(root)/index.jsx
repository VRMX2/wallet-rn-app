import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Text, Alert, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { SignOutButton } from '@/components/SignOutButton';
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from '../../hooks/useTransactions';
import { useEffect, useState } from 'react';
import PageLoader from "../../components/PageLoader";
import { styles } from '../../assets/styles/home.styles';
import { BalanceCard } from "../../components/BalanceCard";
import { TransactionItem } from "../../components/TransactionItem";
import NoTransactionsFound from "../../components/NoTransactionsFound";
import {COLORS} from "../../constants/colors";

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { 
    transactions, 
    summary, 
    isLoading, 
    error, 
    loadData, 
    deleteTransaction 
  } = useTransactions(user?.id);
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id, loadData]);

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Transaction", 
      "Are you sure you want to delete this transaction?", 
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading && !refreshing) return <PageLoader />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={require("../../assets/images/logo.png")} 
              style={styles.headerLogo} 
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome, </Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>add</Text>
            </TouchableOpacity>
            <SignOutButton />
			</View>
        </View>

        <BalanceCard summary={summary} />
        
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadData}>
              <Ionicons name="refresh" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
		refreshing = {refreshing}
		onRefresh = {handleRefresh}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}